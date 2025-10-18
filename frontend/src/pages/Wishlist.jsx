import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { wishlistAPI, cartAPI } from '../api/api';

function Wishlist() {
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState(null);

  // Updated useQuery for TanStack v5
  const {
    data: wishlistItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await wishlistAPI.get();
      return response.data;
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId) => wishlistAPI.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      showNotification('Removed from wishlist');
    },
    onError: (error) => {
      showNotification(
        error.response?.data?.error || 'Failed to remove from wishlist',
        true
      );
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (data) => cartAPI.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showNotification('Added to cart!');
    },
    onError: (error) => {
      showNotification(
        error.response?.data?.error || 'Failed to add to cart',
        true
      );
    },
  });

  // Notification handler
  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRemove = (productId) => {
    if (window.confirm('Remove this item from wishlist?')) {
      removeFromWishlistMutation.mutate(productId);
    }
  };

  const handleAddToCart = (productId) => {
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading wishlist...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load wishlist. Please try again.
      </div>
    );
  }

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

      {!wishlistItems || wishlistItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mt-[5em]">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-[4em]">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link to={`/products/${item.product.id}`}>
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>

              <div className="p-4">
                <Link to={`/products/${item.product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
                    {item.product.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.product.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    ${item.product.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm ${
                      item.product.stock > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {item.product.stock > 0
                      ? `${item.product.stock} in stock`
                      : 'Out of stock'}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    disabled={
                      item.product.stock === 0 ||
                      addToCartMutation.isPending
                    }
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {addToCartMutation.isPending
                      ? 'Adding...'
                      : 'Add to Cart'}
                  </button>

                  <button
                    onClick={() => handleRemove(item.product.id)}
                    disabled={removeFromWishlistMutation.isPending}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    {removeFromWishlistMutation.isPending
                      ? 'Removing...'
                      : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
