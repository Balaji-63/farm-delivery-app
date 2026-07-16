import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!profile) return <div className="p-6 flex justify-center mt-20">Loading...</div>;

  return (
    <div className="h-full bg-gray-50 min-h-screen">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg">Dashboard</h1>
        <button onClick={handleLogout} className="text-sm bg-green-700 px-3 py-1 rounded hover:bg-green-800 transition">Logout</button>
      </header>
      
      <main className="p-4 mt-4">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Welcome, {profile.full_name}!</h2>
          <p className="text-gray-500 mt-1">ID: {profile.customer_id}</p>
          <p className="text-gray-500">Location: {profile.village}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="font-bold text-gray-700 mb-3">Today's Fresh Products</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-green-500">Cow Milk</div>
            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-red-500">Goat Milk</div>
            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-blue-500">Sea Fish</div>
            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-orange-500">Country Eggs</div>
            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-red-500">Goat Meat</div>
            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-yellow-500">Fresh Water Prawn</div>
            
          </div>
        </div>
      </main>
    </div>
  );
}