import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, IndianRupee, Package, Truck, CheckCircle, Navigation } from 'lucide-react';

const DeliveryOrders = () => {
  // SIMULATED LOGGED-IN DRIVER (Partner ID: 1)
  const PARTNER_ID = 1;

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/delivery/assignments/${PARTNER_ID}`);
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const updateStatus = async (assignmentId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/delivery/assignments/${assignmentId}/status`, {
        delivery_status: newStatus
      });
      fetchAssignments(); // Refresh the list to show the new status
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update the delivery status.");
    }
  };

  // Helper function to render the correct action button based on the current status
  const renderActionButtons = (assignment) => {
    const status = assignment.delivery_status;
    const id = assignment.assignment_id;

    if (status === 'Assigned') {
      return (
        <button onClick={() => updateStatus(id, 'Accepted')} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          <CheckCircle size={18} /> Accept Delivery
        </button>
      );
    }
    if (status === 'Accepted') {
      return (
        <button onClick={() => updateStatus(id, 'Picked Up')} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <Package size={18} /> Mark Picked Up
        </button>
      );
    }
    if (status === 'Picked Up') {
      return (
        <button onClick={() => updateStatus(id, 'Out for Delivery')} className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
          <Navigation size={18} /> Out for Delivery
        </button>
      );
    }
    if (status === 'Out for Delivery') {
      return (
        <button onClick={() => updateStatus(id, 'Delivered')} className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
          <Truck size={18} /> Confirm Delivered
        </button>
      );
    }
    if (status === 'Delivered') {
      return (
        <div className="w-full py-3 bg-green-100 text-green-800 rounded-lg font-medium text-center flex items-center justify-center gap-2 border border-green-200">
          <CheckCircle size={18} /> Delivery Completed
        </div>
      );
    }
    return null;
  };

  // Helper to color-code the status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Assigned': return 'bg-indigo-100 text-indigo-800';
      case 'Accepted': return 'bg-blue-100 text-blue-800';
      case 'Picked Up': return 'bg-purple-100 text-purple-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading assigned orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Assigned Orders</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.assignment_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Header / Status */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div>
                <p className="text-xs text-gray-500 font-medium">ORDER ID</p>
                <p className="font-bold text-gray-800">#{assignment.order_id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(assignment.delivery_status)}`}>
                {assignment.delivery_status}
              </span>
            </div>

            {/* Customer Details */}
            <div className="p-5 flex-1 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{assignment.customer_name}</h3>
                
                <div className="flex items-start gap-2 mt-2 text-gray-600">
                  <MapPin size={18} className="shrink-0 mt-0.5 text-gray-400" />
                  <p className="text-sm leading-snug">{assignment.delivery_address}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-3 text-gray-600">
                  <Phone size={18} className="text-gray-400" />
                  <a href={`tel:${assignment.mobile_number}`} className="text-sm font-medium text-indigo-600 hover:underline">
                    {assignment.mobile_number}
                  </a>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Payment Details */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Payment</p>
                  <p className="text-sm font-semibold text-gray-700">{assignment.payment_method}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Collect</p>
                  <p className="text-lg font-bold text-green-700 flex items-center justify-end">
                    <IndianRupee size={16} />
                    {assignment.total_amount}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-100 bg-white">
              {renderActionButtons(assignment)}
            </div>
            
          </div>
        ))}

        {assignments.length === 0 && (
          <div className="col-span-full py-12 bg-white rounded-xl border border-gray-100 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700">No Orders Assigned</h3>
            <p className="text-gray-500 mt-1">You have no pending deliveries at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrders;