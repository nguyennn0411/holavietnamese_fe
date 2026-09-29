import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '@/infrastructure/api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile when authenticated
  const fetchProfile = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      setLoading(true);
      const data = await authApi.getProfile();
      if (data && data.code === 1000) {
        setUser(data.result);
        localStorage.setItem('user', JSON.stringify(data.result));
        return data.result;
      }
      return null;
    } catch (error) {
      console.error('Failed to load profile:', error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: if token exists, load profile
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchProfile]);

  // LOGIN: call API, store token + user info
  const login = async (username, password) => {
    try {
      const data = await authApi.login(username, password);

      if (data && data.code === 1000 && data.result?.authenticated) {
        const { token, userId, username: uname, fullName, roles } = data.result;

        localStorage.setItem('token', token);
        setAccessToken(token);
        setIsAuthenticated(true);

        const userInfo = { userId, username: uname, fullName, roles };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);

        // Also fetch full profile in background
        fetchProfile();

        return { success: true };
      }
      return { success: false, message: data?.message || 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: error?.message || 'Login failed. Please try again.' };
    }
  };

  // REGISTER: call API
  const register = async (payload) => {
    try {
      const data = await authApi.register(payload);
      if (data && data.code === 1000) {
        return { success: true, data: data.result };
      }
      return { success: false, message: data?.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error?.message || 'Registration failed. Please try again.' };
    }
  };

  // LOGIN WITH GOOGLE: send Google credential to BE
  const loginWithGoogle = async (credential) => {
    try {
      const data = await authApi.loginWithGoogle(credential);

      if (data && data.code === 1000 && data.result?.authenticated) {
        const { token, userId, username: uname, fullName, roles } = data.result;

        localStorage.setItem('token', token);
        setAccessToken(token);
        setIsAuthenticated(true);

        const userInfo = { userId, username: uname, fullName, roles };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);

        fetchProfile();

        return { success: true };
      }
      return { success: false, message: data?.message || 'Google login failed' };
    } catch (error) {
      return { success: false, message: error?.message || 'Google login failed. Please try again.' };
    }
  };

  // LOGOUT: call API, clear everything
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Role check helper
  const hasRole = useCallback((role) => {
    if (!role || !user) return false;
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    if (Array.isArray(role)) {
      return role.some((r) => userRoles.includes(r));
    }
    return userRoles.includes(role);
  }, [user]);

  const contextValue = {
    accessToken,
    isAuthenticated,
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    hasRole,
    refreshProfile: fetchProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
