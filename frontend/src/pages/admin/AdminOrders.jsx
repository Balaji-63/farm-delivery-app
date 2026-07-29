import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Truck, X } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form State for updates
  const [updateData, setUpdateData] = useState({
    status: '',
    delivery_partner: ''
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.order_status, // Fixed from order.status
      delivery_partner: order.delivery_partner || ''
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Fixed: using selectedOrder.order_id instead of selectedOrder.id
      await axios.put(`http://localhost:8000/api/admin/orders/${selectedOrder.order_id}/status`, updateData);
      setIsModalOpen(false);
      fetchOrders(); // Refresh the list
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  // Helper to color-code statuses
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
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
                <td className="p-4 font-semibold text-green-700">₹{order.total_amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="p-4 flex items-center justify-end gap-3">
                  <button onClick={() => openModal(order)} className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <Truck size={16} /> Update Status
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No orders found.</td>
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
              <h2 className="text-xl font-bold text-gray-800">Update Order #{selectedOrder.order_id}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <form id="orderForm" onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                  <select 
                    value={updateData.status} 
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign Delivery Partner</label>
                  <input 
                    type="text" 
                    value={updateData.delivery_partner} 
                    onChange={(e) => setUpdateData({...updateData, delivery_partner: e.target.value})}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank if unassigned.</p>
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