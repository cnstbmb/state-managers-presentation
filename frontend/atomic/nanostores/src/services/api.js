import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

// Перехватчик для логирования
api.interceptors.request.use(request => {
    console.log('📤 API Request:', request.method?.toUpperCase(), request.url);
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('📥 API Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('❌ API Error:', error.message);
        return Promise.reject(error);
    }
);

export const orderAPI = {
    getOrder: (id) => api.get(`/orders/${id}`),
    getOrders: (params) => api.get('/orders', { params }),
    getStats: () => api.get('/stats'),
    updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export default api;
