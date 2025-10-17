import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { cartAPI, ordersAPI } from '../api/api';

function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState(null);

  // ✅ Updated syntax for useQuery (v5)
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartAPI.get();
      return response.data;
    },
  });

  // ✅ Update cart mutation
  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }) =>
      cartAPI.update(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showNotification('Cart updated successfully!');
    },
    onError: (error) => {
      showNotification(
        error.response?.data?.error || 'Failed to update cart',
        true
      );
    },
  });

  // ✅ Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (id) => cartAPI.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showNotification('Item removed from cart');
    },
    onError: (error) => {
      showNotification(
        error.response?.data?.error || 'Failed to remove item',
        true
      );
    },
  });

  // ✅ Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async () => ordersAPI.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showNotification('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 1500);
    },
    onError: (error) => {
      showNotification(
        error.response?.data?.error || 'Failed to place order',
        true
      );
    },
  });

  // ✅ Notification helper
  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartMutation.mutate({ id: itemId, quantity: newQuantity });
  };

  const handleRemove = (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCartMutation.mutate(itemId);
    }
  };

  const handleCheckout = () => {
    if (window.confirm('Place this order?')) {
      placeOrderMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load cart. Please try again.
      </div>
    );
  }

  const cartItems = cartData?.items || [];
  const total = cartData?.total || 0;

  return (
    <div>
      {notification && (
        <div
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg ${
            notification.isError ? 'bg-red-500' : 'bg-green-500'
          } text-white z-50`}
        >
          {notification.message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mt-[4em]">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6  mt-[4em]">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border-b last:border-b-0"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={
                        item.quantity === 1 ||
                        updateCartMutation.isPending
                      }
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={
                        item.quantity >= item.product.stock ||
                        updateCartMutation.isPending
                      }
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removeFromCartMutation.isPending}
                    className="text-red-500 hover:text-red-700 px-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={placeOrderMutation.isPending}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold cursor-pointer"
              >
                {placeOrderMutation.isPending
                  ? 'Processing...'
                  : 'Proceed to Checkout'}
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
