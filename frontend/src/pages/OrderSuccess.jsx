import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails } from '../api';

export default function OrderSuccess() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getOrderDetails(orderId);
                setOrder(res.data);
            } catch (error) {
                console.error("Error fetching order", error);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (!order) return <div className="text-center p-10">Loading Order Details...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-sm border text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                ✓
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">Thank you for choosing Village Fresh. Your farm-fresh products are on the way.</p>
            
            <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3 mb-6">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-semibold">{order.order_id}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-semibold">{order.payment_method}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Total Amount:</span>
                    <span className="font-bold text-green-600">₹{order.total_amount}</span>
                </div>
                <div className="flex justify-between pt-2">
                    <span className="text-gray-500">Status:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{order.order_status}</span>
                </div>
            </div>

            <Link to="/" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition">
                Continue Shopping
            </Link>
        </div>
    );
}