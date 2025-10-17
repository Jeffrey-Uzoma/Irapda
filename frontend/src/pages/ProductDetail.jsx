import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, cartAPI, wishlistAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');

  const { data: product, isLoading } = useQuery(['product', id], async () => {
    const response = await productsAPI.getById(id);
    return response.data;
  });

  const { data: wishlistData } = useQuery(
    'wishlist',
    async () => {
      const response = await wishlistAPI.get();
      return response.data;
    },
    { enabled: !!user }
  );

  const addToCartMutation = useMutation(
    (data) => cartAPI.add(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
        showNotification('Added to cart!');
      },
      onError: (error) => {
        showNotification(error.response?.data?.error || 'Failed to add to cart', true);
      }
    }
  );

  const toggleWishlistMutation = useMutation(
    ({ productId, isInWishlist }) => {
      return isInWishlist 
        ? wishlistAPI.remove(productId)
        : wishlistAPI.add(productId);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries('wishlist');
        showNotification(
          variables.isInWishlist ? 'Removed from wishlist' : 'Added to wishlist'
        );
      }
    }
  );

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddToCart = () => {
    if (!user) {
      showNotification('Please login to add items to cart', true);
      return;
    }
    addToCartMutation.mutate({ productId: id, quantity });
  };

  const handleToggleWishlist = () => {
    if (!user) {
      showNotification('Please login to add items to wishlist', true);
      return;
    }
    const isInWishlist = wishlistData?.some(item => item.productId === id);
    toggleWishlistMutation.mutate({ productId: id, isInWishlist });
  };

  const isInWishlist = wishlistData?.some(item => item.productId === id);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Products
      </button>

      {notification && (
        <div className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg ${
          notification.isError ? 'bg-red-500' : 'bg-green-500'
        } text-white z-50`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-6">
              <span className={`text-lg ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-24 px-4 py-2 border rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCartMutation.isLoading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
              >
                {addToCartMutation.isLoading ? 'Adding...' : 'Add to Cart'}
              </button>

              {user && (
                <button
                  onClick={handleToggleWishlist}
                  disabled={toggleWishlistMutation.isLoading}
                  className={`px-6 py-3 rounded-lg border text-lg ${
                    isInWishlist
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {isInWishlist ? '❤ Saved' : '♡ Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;