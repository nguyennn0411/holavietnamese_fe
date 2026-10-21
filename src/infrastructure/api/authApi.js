import axiosClient from '@/infrastructure/api/axiosClient';

/** @typedef {import('./authApi.types').RegisterRequest} RegisterRequest */
/** @typedef {import('./authApi.types').RegisterResponse} RegisterResponse */
/** @typedef {import('./authApi.types').VerifyEmailOtpResponse} VerifyEmailOtpResponse */
/** @typedef {import('./authApi.types').ResendVerificationOtpResponse} ResendVerificationOtpResponse */

const authApi = {
  login: async (username, password) => {
    return axiosClient.post('/api/auth/token', { username, password });
  },

  /** @param {RegisterRequest} payload @returns {Promise<RegisterResponse>} */
  register: async (payload) => {
    return axiosClient.post('/api/auth/register', payload);
  },

  /** @returns {Promise<VerifyEmailOtpResponse>} */
  verifyEmailOtp: async (email, otp) => {
    return axiosClient.post('/api/auth/verify-email/otp', { email, otp });
  },

  /** @returns {Promise<ResendVerificationOtpResponse>} */
  resendVerificationOtp: async (email) => {
    return axiosClient.post('/api/auth/verify-email/resend', { email });
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

  loginWithGoogle: async (credential) => {
    return axiosClient.post('/api/auth/google', { credential });
  },
};

export default authApi;
