import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, ShoppingCart, Clock, CheckCircle, Users, LayoutGrid, Package } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    pending_orders: 0,
    delivered_orders: 0,
    total_customers: 0,
    total_categories: 0,
    total_products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/dashboard-summary');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.total_revenue.toLocaleString()}`, icon: <IndianRupee size={24} className="text-green-600" />, bg: "bg-green-100" },
    { title: "Total Orders", value: stats.total_orders, icon: <ShoppingCart size={24} className="text-blue-600" />, bg: "bg-blue-100" },
    { title: "Pending Orders", value: stats.pending_orders, icon: <Clock size={24} className="text-orange-600" />, bg: "bg-orange-100" },
    { title: "Delivered Orders", value: stats.delivered_orders, icon: <CheckCircle size={24} className="text-teal-600" />, bg: "bg-teal-100" },
    { title: "Total Customers", value: stats.total_customers, icon: <Users size={24} className="text-purple-600" />, bg: "bg-purple-100" },
    { title: "Categories", value: stats.total_categories, icon: <LayoutGrid size={24} className="text-pink-600" />, bg: "bg-pink-100" },
    { title: "Active Products", value: stats.total_products, icon: <Package size={24} className="text-indigo-600" />, bg: "bg-indigo-100" }
  ];

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-full ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;