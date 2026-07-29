import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    unit: '1 kg',
    quantity_in_stock: '',
    category_id: '',
    product_image: '',
    is_active: true
  });

  // Fetch Products and Categories on Load
  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://localhost:8000/api/admin/products'),
        axios.get('http://localhost:8000/api/admin/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Open Modal for Add or Edit
  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        original_price: product.original_price || '',
        unit: product.unit,
        quantity_in_stock: product.quantity_in_stock,
        category_id: product.category_id,
        product_image: product.product_image || '',
        is_active: product.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', description: '', price: '', original_price: '', 
        unit: '1 kg', quantity_in_stock: '', category_id: categories[0]?.id || '', 
        product_image: '', is_active: true
      });
    }
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/admin/products/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:8000/api/admin/products', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/products/${id}`);
        fetchData();
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <button 
          onClick={() => openModal()} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  {prod.product_image ? (
                    <img src={prod.product_image} alt={prod.name} className="w-12 h-12 object-cover rounded-lg border" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Img</div>
                  )}
                </td>
                <td className="p-4 font-medium text-gray-800">{prod.name}</td>
                <td className="p-4 text-green-700 font-semibold">₹{prod.price} / {prod.unit}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${prod.quantity_in_stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {prod.quantity_in_stock} in stock
                  </span>
                </td>
                <td className="p-4 flex items-center justify-end gap-3">
                  <button onClick={() => openModal(prod)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No products found. Add your first product!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500">
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit (e.g., 1 kg, 500g, 1 bunch)</label>
                  <input type="text" name="unit" value={formData.unit} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹) - Optional</label>
                  <input type="number" name="original_price" value={formData.original_price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" name="quantity_in_stock" value={formData.quantity_in_stock} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" name="product_image" value={formData.product_image} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"></textarea>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" form="productForm" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm">
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;