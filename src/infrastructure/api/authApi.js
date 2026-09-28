import axiosClient from '@/infrastructure/api/axiosClient';

const authApi = {
  login: async (username, password) => {
    return axiosClient.post('/api/auth/token', { username, password });
  },

  register: async (payload) => {
    return axiosClient.post('/api/users/register', payload);
  },

  getProfile: async () => {
    return axiosClient.get('/api/users/me');
  },

  refreshToken: async (token) => {
    return axiosClient.post('/api/auth/refresh', { token });
  },

  logout: async (token) => {
    return axiosClient.post('/api/auth/logout', { token }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default authApi;
