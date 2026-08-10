import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, X } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]); // 🔥 NEW: State for delivery partners
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form State for updates
  const [updateData, setUpdateData] = useState({
    status: '',
    delivery_partner_id: '' // 🔥 NEW: Changed to handle the Partner's Database ID
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  // 🔥 NEW: Fetch only 'Active' delivery partners for the dropdown
  const fetchPartners = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/delivery-partners');
      const activePartners = res.data.filter(p => p.status === 'Active');
      setPartners(activePartners);
    } catch (err) {
      console.error("Failed to fetch delivery partners", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPartners(); // Fetch partners when page loads
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.order_status,
      delivery_partner_id: '' 
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // 🔥 NEW: If a partner is selected, use the Delivery Assignment API
      if (updateData.delivery_partner_id) {
        await axios.post('http://localhost:8000/api/admin/delivery-assignments', {
          order_id: selectedOrder.order_id,
          delivery_partner_id: parseInt(updateData.delivery_partner_id)
        });
      } else {
        // Otherwise, just update the generic order status
        await axios.put(`http://localhost:8000/api/admin/orders/${selectedOrder.order_id}/status`, {
          status: updateData.status
        });
      }
      
      setIsModalOpen(false);
      fetchOrders(); // Refresh the list
    } catch (err) {
      console.error("Failed to update order", err);
      alert("Failed to update the order. Please try again.");
    }
  };

  // Helper to color-code statuses
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Assigned': return 'bg-indigo-100 text-indigo-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer ID</th>
              <th className="p-4 font-medium">Driver</th>
              <th className="p-4 font-medium">Total Amount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">#{order.order_id}</td>
                <td className="p-4 text-gray-600">{order.customer_id}</td>
                <td className="p-4 text-gray-600">{order.delivery_partner || 'Unassigned'}</td>
                <td className="p-4 font-semibold text-green-700">₹{order.total_amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="p-4 flex items-center justify-end gap-3">
                  <button onClick={() => openModal(order)} className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <Truck size={16} /> Manage
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

      {/* Update Order Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Manage Order #{selectedOrder.order_id}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <form id="orderForm" onSubmit={handleUpdate} className="space-y-4">
                
                {/* STATUS DROPDOWN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Order Status</label>
                  <select 
                    value={updateData.status} 
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">If a driver is assigned below, status will automatically change to "Assigned".</p>
                </div>

                <hr className="my-4" />

                {/* 🔥 NEW: PARTNER ASSIGNMENT DROPDOWN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Delivery Partner</label>
                  <select 
                    value={updateData.delivery_partner_id} 
                    onChange={(e) => setUpdateData({...updateData, delivery_partner_id: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">-- Select a Driver --</option>
                    {partners.map(partner => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name} ({partner.partner_id})
                      </option>
                    ))}
                  </select>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" form="orderForm" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm">
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;