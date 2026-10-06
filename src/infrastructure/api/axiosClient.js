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

const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  ['userId', 'username', 'fullName', 'roles'].forEach((key) => localStorage.removeItem(key));
};

// RESPONSE interceptor: unwrap ApiResponse and centralize authentication failures
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const responseBody = error.response?.data;
    if (status === 401) {
      const path = window.location.pathname;
      clearAuthStorage();
      if (!PUBLIC_API_PREFIXES.some((prefix) => error.config?.url?.startsWith(prefix)) && path !== '/login') {
        const returnTo = `${path}${window.location.search}`;
        window.location.assign(`/login?from=${encodeURIComponent(returnTo)}`);
      }
    } else if (status === 403 && window.location.pathname !== '/forbidden') {
      window.location.assign('/forbidden');
    }

    const normalizedError = new Error(responseBody?.message || error.message || 'Không thể kết nối đến máy chủ.');
    normalizedError.status = status;
    normalizedError.code = responseBody?.code;
    normalizedError.details = responseBody?.error;
    return Promise.reject(normalizedError);
  },
);

export default axiosClient;
