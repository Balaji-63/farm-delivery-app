import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, User } from 'lucide-react';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderAndTracking = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both order details and tracking data simultaneously
        const [orderRes, trackingRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/orders/${orderId}`, { headers }),
          axios.get(`http://localhost:8000/api/tracking/${orderId}`)
        ]);

        setOrder(orderRes.data);
        setTracking(trackingRes.data);
      } catch (err) {
        console.error("Failed to fetch order details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndTracking();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 flex flex-col items-center gap-3">
          <Package className="animate-bounce text-green-600" size={32} />
          <p>Locating your farm-fresh order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">Order not found.</div>;
  }

  // Define our timeline steps
  const timelineSteps = [
    { label: 'Order Placed', statusKey: 'Pending', icon: <Clock size={20} /> },
    { label: 'Order Confirmed', statusKey: 'Assigned', icon: <Package size={20} /> },
    { label: 'Picked Up', statusKey: 'Picked Up', icon: <Truck size={20} /> },
    { label: 'Out for Delivery', statusKey: 'Out for Delivery', icon: <MapPin size={20} /> },
    { label: 'Delivered', statusKey: 'Delivered', icon: <CheckCircle size={20} /> }
  ];

  // Determine current step index based on current status
  const currentStatusIndex = timelineSteps.findIndex(step => step.statusKey === order.order_status) >= 0 
    ? timelineSteps.findIndex(step => step.statusKey === order.order_status) 
    : 0; // Default to 0 if unknown

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/my-orders" className="text-green-600 hover:text-green-700 flex items-center gap-2 font-medium w-fit">
          <ArrowLeft size={20} /> Back to My Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Tracking Timeline & Driver Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tracking Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Track Order #{order.order_id}</h1>
                <p className="text-gray-500 mt-1">
                  Placed on {new Date(order.order_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              {tracking?.estimated_delivery && order.order_status !== 'Delivered' && order.order_status !== 'Cancelled' && (
                <div className="text-right bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Estimated Arrival</p>
                  <p className="text-lg font-bold text-green-700">
                    {new Date(tracking.estimated_delivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-4 md:pl-8">
              {/* Vertical connecting line */}
              <div className="absolute left-[31px] md:left-[47px] top-6 bottom-6 w-0.5 bg-gray-200"></div>
              
              {/* Dynamic filled line based on progress */}
              <div 
                className="absolute left-[31px] md:left-[47px] top-6 w-0.5 bg-green-500 transition-all duration-500"
                style={{ height: `${(currentStatusIndex / (timelineSteps.length - 1)) * 100}%` }}
              ></div>

              <div className="space-y-8 relative">
                {timelineSteps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  // Find if we have a timestamp for this status in tracking history
                  const historyLog = tracking?.tracking_history?.find(log => log.status === step.statusKey);

                  return (
                    <div key={index} className="flex items-start gap-4 md:gap-6">
                      {/* Icon Bubble */}
                      <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-4 border-white shadow-sm transition-colors ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 pt-1 md:pt-2">
                        <h3 className={`font-bold text-lg ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </h3>
                        {historyLog && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <Clock size={14} />
                            {new Date(historyLog.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                        {isCurrent && !isCompleted && order.order_status !== 'Cancelled' && (
                          <p className="text-sm text-green-600 font-medium mt-1 animate-pulse">Currently processing...</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.order_status === 'Cancelled' && (
              <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-100">
                <CheckCircle size={24} />
                <div>
                  <h4 className="font-bold">Order Cancelled</h4>
                  <p className="text-sm">This order has been cancelled and will not be delivered.</p>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Partner Card */}
          {tracking?.delivery_partner && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Your Delivery Partner</p>
                  <p className="font-bold text-gray-800 text-lg">{tracking.delivery_partner.name}</p>
                </div>
              </div>
              <a 
                href={`tel:${tracking.delivery_partner.mobile_number}`}
                className="w-12 h-12 bg-green-100 text-green-700 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                title="Call Driver"
              >
                <Phone size={20} />
              </a>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary (Products & Totals) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.total_amount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span>₹{order.total_amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;