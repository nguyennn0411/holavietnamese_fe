import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public API endpoints that don't need a Bearer token
const PUBLIC_API_PREFIXES = [
  '/api/auth/token',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/auth/google',
  '/api/auth/register',
  '/api/users/register',
  '/api/auth/verify-email',
  '/api/auth/forgot-password',
];

// REQUEST interceptor: auto-attach Bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_API_PREFIXES.some(prefix => config.url?.startsWith(prefix));
    if (!isPublic) {
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
  (response) => response.data, // Unwrap: callers receive ApiResponse { code, message, result } directly
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if it's already on an auth page
      const path = window.location.pathname;
      if (!path.startsWith('/login') && !path.startsWith('/register') && !path.startsWith('/forgot-password') && !path.startsWith('/verify-email')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response ? error.response.data : error);
  },
);

export default axiosClient;
