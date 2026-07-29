import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    category_name: '',
    category_image: '',
    status: 'Active'
  });

  // Fetch Categories on Load
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/categories');
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Modal for Add or Edit
  const openModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        category_name: category.category_name,
        category_image: category.category_image || '',
        status: category.status
      });
    } else {
      setEditingId(null);
      setFormData({ category_name: '', category_image: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/admin/categories/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:8000/api/admin/categories', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Failed to save category", err);
    }
  };

  // Toggle Status directly from table
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`http://localhost:8000/api/admin/categories/${id}`, { status: newStatus });
      fetchCategories();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Failed to delete category", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <button 
          onClick={() => openModal()} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Category Name</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  {cat.category_image ? (
                    <img src={cat.category_image} alt={cat.category_name} className="w-12 h-12 object-cover rounded-lg border" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Img</div>
                  )}
                </td>
                <td className="p-4 font-medium text-gray-800">{cat.category_name}</td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleStatus(cat.id, cat.status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {cat.status}
                  </button>
                </td>
                <td className="p-4 flex items-center justify-end gap-3">
                  <button onClick={() => openModal(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No categories found. Click "Add Category" to create one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text" 
                  name="category_name" 
                  value={formData.category_name} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., Fresh Vegetables"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input 
                  type="text" 
                  name="category_image" 
                  value={formData.category_image} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;