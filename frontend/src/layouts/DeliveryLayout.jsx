import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, History, User, LogOut, Truck } from 'lucide-react';

const DeliveryLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear the driver's JWT token here
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/delivery/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Assigned Orders', path: '/delivery/orders', icon: <ClipboardList size={20} /> },
    { name: 'Delivery History', path: '/delivery/history', icon: <History size={20} /> },
    { name: 'Profile', path: '/delivery/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-indigo-800">
          <Truck size={28} className="text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Driver Portal</h2>
            <p className="text-xs text-indigo-300">Village Fresh</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header (Visible only on small screens) */}
        <header className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <Truck size={24} className="text-indigo-400" />
            <h2 className="text-lg font-bold">Driver Portal</h2>
          </div>
          <button onClick={handleLogout} className="text-indigo-200 hover:text-white">
            <LogOut size={24} />
          </button>
        </header>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeliveryLayout;