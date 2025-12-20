import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization && !config.headers.authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;