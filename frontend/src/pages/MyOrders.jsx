import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders, reorder } from '../api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    try {
      await reorder(orderId);
      navigate('/cart');
    } catch (error) {
      alert("Failed to reorder items");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Preparing': 'bg-indigo-100 text-indigo-800',
      'Out for Delivery': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-20 text-center">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/home" className="text-green-600 font-semibold hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.order_id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-gray-800">{order.order_id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-1">
                  Total: ₹{order.total_amount} • {order.payment_method}
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Link 
                  to={`/my-orders/${order.order_id}`}
                  className="flex-1 md:flex-none text-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition"
                >
                  View Details
                </Link>
                {order.order_status === 'Delivered' && (
                  <button 
                    onClick={() => handleReorder(order.order_id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Reorder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}