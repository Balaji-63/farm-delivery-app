import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserX, UserCheck } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleCustomerStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const confirmMessage = newStatus === 'Inactive' 
      ? "Are you sure you want to block this customer?" 
      : "Are you sure you want to unblock this customer?";

    if (window.confirm(confirmMessage)) {
      try {
        await axios.put(`http://localhost:8000/api/admin/customers/${id}/status`, { status: newStatus });
        fetchCustomers(); // Refresh the list
      } catch (err) {
        console.error("Failed to update customer status", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Customer ID</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">{customer.customer_id}</td>
                <td className="p-4 font-medium text-gray-800">{customer.full_name}</td>
                <td className="p-4 text-gray-600">
                  <div>{customer.mobile_number}</div>
                  {customer.email && <div className="text-xs text-gray-400">{customer.email}</div>}
                </td>
                <td className="p-4 text-gray-600">{customer.village}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {customer.status || 'Active'}
                  </span>
                </td>
                <td className="p-4 flex justify-end">
                  <button 
                    onClick={() => toggleCustomerStatus(customer.id, customer.status || 'Active')}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                      customer.status === 'Active' 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {customer.status === 'Active' ? (
                      <><UserX size={16} /> Block</>
                    ) : (
                      <><UserCheck size={16} /> Unblock</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No customers registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;