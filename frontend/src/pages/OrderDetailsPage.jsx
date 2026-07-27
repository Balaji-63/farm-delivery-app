import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails, cancelOrder } from '../api';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Timeline Steps
  const steps = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

  useEffect(() => {
    fetchDetails();
  }, [orderId]);

  const fetchDetails = async () => {
    try {
      const res = await getOrderDetails(orderId);
      setOrder(res.data);
    } catch (error) {
      console.error("Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if(window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder(orderId);
        fetchDetails(); // Refresh details to show 'Cancelled' status
      } catch (error) {
        alert("Could not cancel order.");
      }
    }
  };

  if (loading) return <div className="p-20 text-center">Loading details...</div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  const currentStepIndex = steps.indexOf(order.order_status);
  const isCancelled = order.order_status === "Cancelled";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/my-orders" className="text-green-600 hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.order_id}</h1>
            <p className="text-gray-500">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Download Invoice
            </button>
            {order.order_status === 'Pending' && (
              <button onClick={handleCancel} className="px-4 py-2 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100">
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* ORDER TRACKING TIMELINE */}
        {!isCancelled ? (
          <div className="py-6 border-t border-b border-gray-100 my-6">
            <h3 className="text-lg font-semibold mb-6">Tracking Status</h3>
            <div className="flex items-center justify-between relative">
              {/* Line behind steps */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
              
              {steps.map((step, index) => {
                const isCompleted = currentStepIndex >= index;
                const isActive = currentStepIndex === index;
                return (
                  <div key={step} className="flex flex-col items-center bg-white px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    } ${isActive ? 'ring-4 ring-green-200' : ''}`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className={`text-xs md:text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-6 border-t border-b border-red-200 my-6 bg-red-50 text-center rounded">
            <p className="text-red-700 font-bold text-lg">This order has been cancelled.</p>
          </div>
        )}

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Items Total:</span> <span>₹{order.total_amount - 40}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery Charge:</span> <span>₹40</span></div>
              <div className="flex justify-between font-bold pt-2 border-t text-lg"><span className="text-gray-900">Grand Total:</span> <span>₹{order.total_amount}</span></div>
              <div className="flex justify-between pt-2"><span className="text-gray-500">Payment Method:</span> <span className="font-semibold">{order.payment_method}</span></div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Items ({order.items.length})</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <span>Product ID #{item.product_id} <span className="text-gray-500">x {item.quantity}</span></span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}