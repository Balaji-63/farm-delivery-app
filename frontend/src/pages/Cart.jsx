import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.get('http://localhost:8000/api/cart/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQuantity) => {
    try {
      await axios.put(`http://localhost:8000/api/cart/${cartId}?quantity=${newQuantity}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryCharge = totalAmount > 0 ? 50 : 0;
  const grandTotal = totalAmount + deliveryCharge;

  if (loading) return <div className="p-20 text-center font-bold">Loading Cart...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Farm Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
            <Link to="/home" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-500 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
                  <img src={item.product.product_image} alt={item.product.product_name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-900">{item.product.product_name}</h3>
                    <p className="text-green-600 font-bold">₹{item.product.price} <span className="text-sm font-normal text-gray-500">/ {item.product.unit}</span></p>
                  </div>
                  
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 text-gray-600"><Minus className="w-4 h-4"/></button>
                    <span className="px-3 font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 text-gray-600"><Plus className="w-4 h-4"/></button>
                  </div>
                  
                  <div className="font-extrabold text-lg w-24 text-right">
                    ₹{item.product.price * item.quantity}
                  </div>
                  
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2 transition">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between"><span>Total Items:</span> <span className="font-bold text-gray-900">{cartItems.length}</span></div>
                <div className="flex justify-between"><span>Subtotal:</span> <span className="font-bold text-gray-900">₹{totalAmount}</span></div>
                <div className="flex justify-between"><span>Delivery Charge:</span> <span className="font-bold text-gray-900">₹{deliveryCharge}</span></div>
              </div>
              <div className="border-t pt-4 mb-6 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                <span className="text-2xl font-extrabold text-green-600">₹{grandTotal}</span>
              </div>
              <button className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-500 transition flex justify-center items-center gap-2">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
              <Link to="/home" className="block text-center mt-4 text-gray-500 hover:text-green-600 font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}