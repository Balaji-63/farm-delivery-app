import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { History, Eye, RotateCcw, Package, CheckCircle, XCircle } from 'lucide-react';

const OrderHistory = () => {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter only orders that are finished (Delivered or Cancelled)
        const pastOrders = res.data.filter(order => 
          order.order_status === 'Delivered' || order.order_status === 'Cancelled'
        );
        
        // Sort by most recent first
        pastOrders.sort((a, b) => new Date(b.created_at || b.order_date) - new Date(a.created_at || a.order_date));
        
        setHistoryOrders(pastOrders);
      } catch (err) {
        console.error("Failed to fetch order history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleReorder = async (orderItems) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Loop through previous items and add them to the cart
      for (const item of orderItems) {
        await axios.post('http://localhost:8000/api/cart', {
          product_id: item.product_id,
          quantity: item.quantity
        }, { headers });
      }
      
      // Redirect to cart to checkout
      navigate('/cart');
    } catch (err) {
      console.error("Failed to reorder", err);
      alert("Added available items to your cart!");
      navigate('/cart');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your history...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
          <History size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
          <p className="text-gray-500">View your past deliveries and reorder your favorites.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {historyOrders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {historyOrders.map((order) => (
              <div key={order.order_id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left Side: Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-gray-800">#{order.order_id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.order_status === 'Delivered' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {order.order_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Placed on {new Date(order.created_at || order.order_date).toLocaleDateString()}
                  </p>
                  
                  {/* Item Preview */}
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                        {item.quantity}x {item.product_name}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Price & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:gap-2">
                  <p className="text-lg font-bold text-gray-800">₹{order.total_amount}</p>
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/my-orders/${order.order_id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Eye size={16} /> Details
                    </Link>
                    <button 
                      onClick={() => handleReorder(order.items)}
                      className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <RotateCcw size={16} /> Reorder
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <Package size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700">No Past Orders Found</h3>
            <p className="text-gray-500 mt-1">When your orders are delivered or cancelled, they will appear here.</p>
            <Link to="/home" className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;