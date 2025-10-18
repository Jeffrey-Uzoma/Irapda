import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, cartAPI, wishlistAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

function Products() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState('');
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsAPI.getAll();
      return response.data;
    },
  });

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await wishlistAPI.get();
      return response.data;
    },
    enabled: !!user,
  });

  //Updated: useMutation now uses object syntax
  const addToCartMutation = useMutation({
    mutationFn: (data) => cartAPI.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showNotification('Added to cart!');
    },
    onError: (error) => {
      showNotification(error.response?.data?.error || 'Failed to add to cart', true);
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: ({ productId, isInWishlist }) => {
      return isInWishlist
        ? wishlistAPI.remove(productId)
        : wishlistAPI.add(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddToCart = (productId) => {
    if (!user) {
      showNotification('Please login to add items to cart', true);
      return;
    }
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  const handleToggleWishlist = (productId) => {
    if (!user) {
      showNotification('Please login to add items to wishlist', true);
      return;
    }
    const isInWishlist = wishlistData?.some(item => item.productId === productId);
    toggleWishlistMutation.mutate({ productId, isInWishlist });
  };

  const isInWishlist = (productId) => {
    return wishlistData?.some(item => item.productId === productId);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {notification && (
        <div
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg ${
            notification.isError ? 'bg-red-500' : 'bg-green-500'
          } text-white z-50`}
        >
          {notification.message}
        </div>
      )}

      {products?.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>

              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0 || addToCartMutation.isLoading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer"
                  >
                    Add to Cart
                  </button>

                  {user && (
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`px-4 py-2 rounded border hover:cursor-pointer ${
                        isInWishlist(product.id)
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ❤
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
