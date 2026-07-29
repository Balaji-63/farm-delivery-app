import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Tags, Package, ShoppingCart, 
  Users, Truck, FileBarChart, LogOut, User as UserIcon 
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens and redirect
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Delivery', path: '/admin/delivery', icon: <Truck size={20} /> },
    { name: 'Reports', path: '/admin/reports', icon: <FileBarChart size={20} /> },
    { name: 'Profile', path: '/admin/profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-green-700">
          Village Fresh <span className="text-sm block font-normal text-green-300">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-green-700 text-white' : 'hover:bg-green-700 hover:text-green-100'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-green-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Admin Control Center</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;