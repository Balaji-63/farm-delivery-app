import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, UserCheck, UserX, X } from 'lucide-react';

const AdminDelivery = () => {
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    partner_id: '',
    name: '',
    mobile_number: '',
    email: '',
    status: 'Active'
  });

  const fetchPartners = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/delivery-partners');
      setPartners(res.data);
    } catch (err) {
      console.error("Failed to fetch partners", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/admin/delivery-partners', formData);
      setIsModalOpen(false);
      setFormData({ partner_id: '', name: '', mobile_number: '', email: '', status: 'Active' });
      fetchPartners();
    } catch (err) {
      console.error("Failed to add partner", err);
      alert("Failed to add partner. Ensure the Mobile Number and Partner ID are unique.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`http://localhost:8000/api/admin/delivery-partners/${id}/status`, { status: newStatus });
      fetchPartners();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Partners</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Plus size={20} /> Add Partner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Partner ID</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{partner.partner_id}</td>
                <td className="p-4 font-medium text-gray-800">{partner.name}</td>
                <td className="p-4 text-gray-600">
                  <div>{partner.mobile_number}</div>
                  <div className="text-xs text-gray-400">{partner.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    partner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {partner.status}
                  </span>
                </td>
                <td className="p-4 flex justify-end">
                  <button 
                    onClick={() => toggleStatus(partner.id, partner.status)}
                    className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                      partner.status === 'Active' 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {partner.status === 'Active' ? <><UserX size={16} /> Disable</> : <><UserCheck size={16} /> Enable</>}
                  </button>
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No delivery partners found. Add one to get started!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Add Delivery Partner</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <form id="partnerForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner ID</label>
                  <input type="text" name="partner_id" value={formData.partner_id} onChange={handleChange} required placeholder="e.g., DP001" className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" form="partnerForm" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm">
                Save Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDelivery;
