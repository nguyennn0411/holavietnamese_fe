import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public API endpoints that don't need a Bearer token
const PUBLIC_API_ENDPOINTS = [
  '/api/auth/token',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/users/register',
];

// REQUEST interceptor: auto-attach Bearer token
axiosClient.interceptors.request.use(
  (config) => {
    if (!PUBLIC_API_ENDPOINTS.includes(config.url)) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE interceptor: unwrap response.data, handle 401
axiosClient.interceptors.response.use(
  (response) => response.data,        // Unwrap: callers receive { code, message, result } directly
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response ? error.response.data : error);
  },
);

export default axiosClient;
