// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// --- CART API CALLS ---
export const fetchCart = () => axios.get(`${API_URL}/cart`, getAuthHeaders());

// --- DAY 4: CHECKOUT & ADDRESS API CALLS ---
export const fetchAddresses = () => axios.get(`${API_URL}/addresses`, getAuthHeaders());
export const addAddress = (addressData) => axios.post(`${API_URL}/addresses`, addressData, getAuthHeaders());
export const placeOrder = (orderData) => axios.post(`${API_URL}/orders`, orderData, getAuthHeaders());

// --- DAY 5: ORDER MANAGEMENT API CALLS ---
export const getMyOrders = () => axios.get(`${API_URL}/orders`, getAuthHeaders());
export const getOrderDetails = (orderId) => axios.get(`${API_URL}/orders/${orderId}`, getAuthHeaders());
export const cancelOrder = (orderId) => axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, getAuthHeaders());
export const reorder = (orderId) => axios.post(`${API_URL}/orders/${orderId}/reorder`, {}, getAuthHeaders());