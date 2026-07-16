import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/home" className="flex items-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="font-extrabold text-2xl tracking-tight text-white">Village Fresh</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Delivering 100% organic, farm-fresh milk, meat, and daily produce directly from local village farms to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/home" className="hover:text-green-500 transition">Shop Home</Link></li>
              <li><Link to="/customer/dashboard" className="hover:text-green-500 transition">My Account</Link></li>
              <li><a href="#" className="hover:text-green-500 transition">About Us</a></li>
              <li><a href="#" className="hover:text-green-500 transition">Delivery Policy</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Top Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-500 transition">Milk & Dairy</a></li>
              <li><a href="#" className="hover:text-green-500 transition">Fresh Meat</a></li>
              <li><a href="#" className="hover:text-green-500 transition">Sea Food</a></li>
              <li><a href="#" className="hover:text-green-500 transition">Country Eggs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>123 Village Road, Farm District, Chennai, Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>support@villagefresh.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Village Fresh Farm Delivery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}