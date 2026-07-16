import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Leaf, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="font-extrabold text-2xl tracking-tight text-green-800">Village Fresh</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-700 hover:text-green-600 font-semibold transition">Home</Link>
            
            {/* 🔥 NEW: Clickable Cart Link */}
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-green-600 font-semibold transition group">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 mr-1" />
                <span className="absolute -top-2 -right-1 bg-green-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  +
                </span>
              </div>
              <span className="ml-1">Cart</span>
            </Link>
            
            <button onClick={handleLogout} className="flex items-center text-gray-500 hover:text-red-600 font-medium transition">
              <LogOut className="h-5 w-5 mr-1.5" /> Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-green-600 transition">
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-lg absolute w-full">
          <div className="flex flex-col space-y-4">
            <Link to="/home" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-600 font-semibold text-lg">Home</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 hover:text-green-600 font-semibold text-lg">
              <ShoppingCart className="h-5 w-5 mr-3" /> Cart
            </Link>
            <button onClick={handleLogout} className="flex items-center text-red-500 font-medium text-lg">
              <LogOut className="h-5 w-5 mr-3" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}