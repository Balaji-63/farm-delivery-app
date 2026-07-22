import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAddresses, addAddress, placeOrder, fetchCart } from '../api'; // Added fetchCart

export default function Checkout() {
    const navigate = useNavigate();
    
    // State for Addresses and Payment
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', mobile_number: '', address: '', village: '', district: '', state: '', pincode: '' });

    // State for Cart Data
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    // Calculate Totals dynamically
    const deliveryCharge = cartTotal > 0 && cartTotal < 500 ? 40 : 0;
    const grandTotal = cartTotal + deliveryCharge;

    useEffect(() => {
        loadAddresses();
        loadCartData();
    }, []);

    const loadAddresses = async () => {
        try {
            const res = await fetchAddresses();
            setAddresses(res.data);
            if (res.data.length > 0) setSelectedAddressId(res.data[0].id);
        } catch (error) {
            console.error("Failed to load addresses", error);
        }
    };

    const loadCartData = async () => {
        try {
            const res = await fetchCart();
            setCartItems(res.data);
            // Calculate total price from the fetched items
            const total = res.data.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
            setCartTotal(total);
        } catch (error) {
            console.error("Failed to load cart data", error);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            await addAddress(formData);
            setShowAddressForm(false);
            loadAddresses(); // Reload addresses to show the new one
        } catch (error) {
            alert("Failed to add address");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) return alert("Please select a delivery address");
        if (cartItems.length === 0) return alert("Your cart is empty!");
        
        try {
            const res = await placeOrder({
                address_id: selectedAddressId,
                payment_method: paymentMethod
            });
            navigate(`/order-success/${res.data.order_id}`);
        } catch (error) {
            alert("Failed to place order. " + (error.response?.data?.detail || ""));
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Address & Payment */}
            <div className="md:col-span-2 space-y-6">
                
                {/* ADDRESS MODULE */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Delivery Address</h2>
                        <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-green-600 font-medium">+ Add New</button>
                    </div>

                    {showAddressForm && (
                        <form onSubmit={handleAddressSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
                            <input type="text" placeholder="Full Name" required className="border p-2 rounded" onChange={e => setFormData({...formData, full_name: e.target.value})} />
                            <input type="text" placeholder="Mobile" required className="border p-2 rounded" onChange={e => setFormData({...formData, mobile_number: e.target.value})} />
                            <input type="text" placeholder="Door No / Street" required className="col-span-2 border p-2 rounded" onChange={e => setFormData({...formData, address: e.target.value})} />
                            <input type="text" placeholder="Village / City" required className="border p-2 rounded" onChange={e => setFormData({...formData, village: e.target.value})} />
                            <input type="text" placeholder="Pincode" required className="border p-2 rounded" onChange={e => setFormData({...formData, pincode: e.target.value})} />
                            <input type="text" placeholder="District" required className="border p-2 rounded" onChange={e => setFormData({...formData, district: e.target.value})} />
                            <input type="text" placeholder="State" required className="border p-2 rounded" onChange={e => setFormData({...formData, state: e.target.value})} />
                            <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded">Save Address</button>
                        </form>
                    )}

                    <div className="space-y-3">
                        {addresses.length === 0 && !showAddressForm && (
                            <p className="text-gray-500 italic">No addresses saved. Please add a new address.</p>
                        )}
                        {addresses.map(addr => (
                            <label key={addr.id} className={`flex items-start p-4 border rounded cursor-pointer ${selectedAddressId === addr.id ? 'border-green-600 bg-green-50' : ''}`}>
                                <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 mr-3" />
                                <div>
                                    <p className="font-semibold">{addr.full_name} <span className="text-gray-500 text-sm ml-2">{addr.mobile_number}</span></p>
                                    <p className="text-sm text-gray-600">{addr.address}, {addr.village}, {addr.district}, {addr.state} - {addr.pincode}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* PAYMENT OPTIONS */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
                    <div className="space-y-3">
                        <label className="flex items-center p-4 border rounded cursor-pointer">
                            <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="mr-3" />
                            Cash on Delivery (COD)
                        </label>
                        <label className="flex items-center p-4 border rounded cursor-pointer opacity-60">
                            <input type="radio" name="payment" disabled className="mr-3" />
                            Online Payment (Coming Soon)
                        </label>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border h-fit sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">Your cart is empty.</p>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span>{item.quantity} x {item.product.product_name}</span>
                                <span>₹{item.quantity * item.product.price}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Item Total</span><span>₹{cartTotal}</span></div>
                    <div className="flex justify-between"><span>Delivery Charge</span><span>₹{deliveryCharge}</span></div>
                    <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹0</span></div>
                    
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Grand Total</span><span>₹{grandTotal}</span>
                    </div>
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    disabled={cartItems.length === 0}
                    className={`w-full mt-6 text-white font-bold py-3 rounded-lg transition-colors ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    Place Order (₹{grandTotal})
                </button>
            </div>
        </div>
    );
}