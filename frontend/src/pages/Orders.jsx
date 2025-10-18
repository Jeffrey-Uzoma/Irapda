import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../api/api';

function Orders() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ordersAPI.getAll();
      return response.data;
    },
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load orders. {error?.message || 'Please try again later.'}
      </div>
    );
  }

  return (
    <div>

      {!orders || orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mt-[5em]">
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden mt-[5em]"
            >
              <div
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {order.items.length}{' '}
                      {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ${order.total.toFixed(2)}
                    </p>
                    <button className="text-blue-600 text-sm mt-2">
                      {expandedOrder === order.id
                        ? '▲ Hide Details'
                        : '▼ View Details'}
                    </button>
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t bg-gray-50 p-6">
                  <h4 className="font-semibold mb-4">Order Items:</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-white p-4 rounded"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold">
                            {item.product.name}
                          </h5>
                          <p className="text-gray-600 text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
