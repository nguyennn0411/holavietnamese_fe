import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '@/infrastructure/api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosClient.post('/api/auth/token', {
        username,
        password,
      });

      if (response.data && response.data.code === 1000) {
        const { token, authenticated } = response.data.result;
        if (authenticated) {
          localStorage.setItem('token', token);
          setIsAuthenticated(true);
          return { success: true };
        }
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axiosClient.post('/api/auth/logout', { token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
