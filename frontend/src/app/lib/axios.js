import axios from 'axios';

// 1. Create the base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Automatically attach the token before the request leaves
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;