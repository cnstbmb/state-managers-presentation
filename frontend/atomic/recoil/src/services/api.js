// src/services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

export const orderAPI = {
    getOrder: (id) => api.get(`/orders/${id}`),
    getOrders: (params) => api.get('/orders', {params}),
    getStats: () => api.get('/stats'),
    updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, {status}),
};

export default api;
