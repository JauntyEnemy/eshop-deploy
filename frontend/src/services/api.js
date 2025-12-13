import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const productService = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
};

export const orderService = {
    create: (data) => api.post('/orders', data),
    track: (code) => api.get(`/orders/track/${code}`),
};

export const deliveryService = {
    getZones: () => api.get('/delivery/zones'),
    getSlots: () => api.get('/delivery/slots'),
};

export const categoryService = {
    getAll: () => api.get('/categories'),
};

export default api;
