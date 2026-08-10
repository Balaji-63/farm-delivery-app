import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle } from 'lucide-react';

const DeliveryDashboard = () => {
  // SIMULATED LOGGED-IN DRIVER (Partner ID: 1)
  const PARTNER_ID = 1; 

  const [stats, setStats] = useState({
    today_deliveries: 0,
    pending_deliveries: 0,
    completed_deliveries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/delivery/dashboard/${PARTNER_ID}`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching delivery stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const statCards = [
    { title: "Today's Deliveries", value: stats.today_deliveries, icon: <Package size={28} className="text-indigo-600" />, bg: "bg-indigo-100" },
    { title: "Pending Deliveries", value: stats.pending_deliveries, icon: <Clock size={28} className="text-orange-600" />, bg: "bg-orange-100" },
    { title: "Completed Deliveries", value: stats.completed_deliveries, icon: <CheckCircle size={28} className="text-green-600" />, bg: "bg-green-100" }
  ];

  if (loading) return <div className="p-8 text-gray-500">Loading your route...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back, Partner!</h1>
          <p className="text-gray-500 mt-1">Here is your delivery summary for today.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`p-4 rounded-full ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryDashboard;