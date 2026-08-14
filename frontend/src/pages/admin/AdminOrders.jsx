import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, X, Clock, Package, MapPin, CheckCircle, AlertCircle, Ban } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // New states for Day 8 Tracking
  const [trackingData, setTrackingData] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  const [updateData, setUpdateData] = useState({
    status: '',
    delivery_partner_id: ''
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/orders');
      // Sort by newest first
      const sortedOrders = res.data.sort((a, b) => b.order_id - a.order_id);
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/delivery-partners');
      setPartners(res.data.filter(p => p.status === 'Active'));
    } catch (err) {
      console.error("Failed to fetch delivery partners", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  const openModal = async (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.order_status,
      delivery_partner_id: '' 
    });
    setTrackingData(null);
    setIsModalOpen(true);
    setLoadingTracking(true);

    // Fetch the live tracking timeline for this specific order
    try {
      const res = await axios.get(`http://localhost:8000/api/tracking/${order.order_id}`);
      setTrackingData(res.data);
    } catch (err) {
      console.error("Failed to fetch tracking data", err);
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleUpdate = async (e, forceStatus = null) => {
    if (e) e.preventDefault();
    
    const statusToApply = forceStatus || updateData.status;

    try {
      if (updateData.delivery_partner_id && !forceStatus) {
        // Assign Driver API
        await axios.post('http://localhost:8000/api/admin/delivery-assignments', {
          order_id: selectedOrder.order_id,
          delivery_partner_id: parseInt(updateData.delivery_partner_id)
        });
      } else {
        // Standard Status Update (or Cancellation)
        await axios.put(`http://localhost:8000/api/admin/orders/${selectedOrder.order_id}/status`, {
          status: statusToApply
        });
      }
      
      setIsModalOpen(false);
      fetchOrders(); 
    } catch (err) {
      console.error("Failed to update order", err);
      alert("Failed to update the order. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Assigned': return 'bg-indigo-100 text-indigo-800';
      case 'Picked Up': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Timeline UI Data
  const timelineSteps = [
    { label: 'Order Placed', statusKey: 'Pending', icon: <Clock size={16} /> },
    { label: 'Assigned', statusKey: 'Assigned', icon: <Package size={16} /> },
    { label: 'Picked Up', statusKey: 'Picked Up', icon: <Truck size={16} /> },
    { label: 'Out for Delivery', statusKey: 'Out for Delivery', icon: <MapPin size={16} /> },
    { label: 'Delivered', statusKey: 'Delivered', icon: <CheckCircle size={16} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Order Tracking & Fulfillment</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Driver</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">#{order.order_id}</td>
                <td className="p-4 text-gray-600">{order.customer_id}</td>
                <td className="p-4 text-gray-600">
                  {order.delivery_partner ? (
                    <span className="flex items-center gap-2"><Truck size={14} className="text-indigo-500"/> {order.delivery_partner}</span>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="p-4 font-semibold text-green-700">₹{order.total_amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="p-4 flex justify-end">
                  <button onClick={() => openModal(order)} className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <MapPin size={16} /> Track & Manage
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Advanced Tracking Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Order #{selectedOrder.order_id}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.order_status)}`}>
                    {selectedOrder.order_status}
                  </span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">Customer ID: {selectedOrder.customer_id}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* LEFT COLUMN: Controls & Details */}
                <div className="space-y-6">
                  
                  {/* Action Form */}
                  {selectedOrder.order_status !== 'Delivered' && selectedOrder.order_status !== 'Cancelled' && (
                    <form id="orderForm" onSubmit={(e) => handleUpdate(e, null)} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                        <Truck size={18} className="text-indigo-600"/> Dispatch Controls
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Update Status Manually</label>
                        <select 
                          value={updateData.status} 
                          onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Delivery Partner</label>
                        <select 
                          value={updateData.delivery_partner_id} 
                          onChange={(e) => setUpdateData({...updateData, delivery_partner_id: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                        >
                          <option value="">-- Select a Driver --</option>
                          {partners.map(partner => (
                            <option key={partner.id} value={partner.id}>
                              {partner.name} ({partner.partner_id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                          Save Changes
                        </button>
                        <button 
                          type="button" 
                          onClick={(e) => handleUpdate(e, 'Cancelled')}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors flex items-center gap-2"
                        >
                          <Ban size={16} /> Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Summary Block */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                     <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-3">Financials</p>
                     <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                        <span>Total Amount</span>
                        <span className="text-green-700">₹{selectedOrder.total_amount}</span>
                     </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Live Tracking Timeline */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Live Tracking Timeline</h3>
                    {trackingData?.estimated_delivery && selectedOrder.order_status !== 'Delivered' && selectedOrder.order_status !== 'Cancelled' && (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded animate-pulse">
                        ETA: {new Date(trackingData.estimated_delivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {loadingTracking ? (
                    <div className="flex items-center gap-2 text-gray-500 py-8">
                      <Clock className="animate-spin" size={20} /> Fetching live timeline...
                    </div>
                  ) : (
                    <div className="relative pl-6">
                      {/* Vertical connecting line */}
                      <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
                      
                      {selectedOrder.order_status === 'Cancelled' ? (
                        <div className="relative z-10 flex gap-4 items-start py-4">
                          <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                            <X size={12} />
                          </div>
                          <div>
                            <p className="font-bold text-red-600">Order Cancelled</p>
                            <p className="text-xs text-gray-500">This fulfillment workflow was aborted.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 relative">
                          {timelineSteps.map((step, index) => {
                            // Find the index of the current status to know how far to highlight
                            const currentIdx = timelineSteps.findIndex(s => s.statusKey === selectedOrder.order_status);
                            const activeIdx = currentIdx === -1 ? 0 : currentIdx;
                            const isCompleted = index <= activeIdx;
                            
                            // Check if backend tracking has a timestamp for this step
                            const logEntry = trackingData?.tracking_history?.find(log => log.status === step.statusKey);

                            return (
                              <div key={index} className="relative z-10 flex gap-4 items-start">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-colors ${
                                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                  {step.icon}
                                </div>
                                <div className="pt-0.5">
                                  <p className={`font-bold text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {step.label}
                                  </p>
                                  {logEntry && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {new Date(logEntry.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  )}
                                  {index === activeIdx && !logEntry && (
                                    <p className="text-xs text-indigo-500 font-medium mt-0.5">Current Phase</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;