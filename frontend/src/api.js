// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// --- DAY 4: CHECKOUT & ADDRESS API CALLS ---
export const fetchAddresses = () => axios.get(`${API_URL}/addresses`, getAuthHeaders());
export const addAddress = (addressData) => axios.post(`${API_URL}/addresses`, addressData, getAuthHeaders());
export const placeOrder = (orderData) => axios.post(`${API_URL}/orders`, orderData, getAuthHeaders());
export const getOrderDetails = (orderId) => axios.get(`${API_URL}/orders/${orderId}`, getAuthHeaders());
// 🔥 NEW: Added fetchCart so the Checkout page stops crashing
export const fetchCart = () => axios.get(`${API_URL}/cart`, getAuthHeaders());