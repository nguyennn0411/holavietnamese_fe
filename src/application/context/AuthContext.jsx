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
        const profile = data.result;
        setUser(prev => {
          const merged = { ...prev, ...profile };
          localStorage.setItem('user', JSON.stringify(merged));
          return merged;
        });
        return data.result;
      }
      return null;
    } catch (error) {
      console.error('Failed to load profile:', error);
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

  // LOGIN: call API, store token + user info with roles
  const login = async (username, password) => {
    try {
      const data = await authApi.login(username, password);

      if (data && data.code === 1000 && data.result?.authenticated) {
        const { token, userId, username: uname, fullName, roles } = data.result;

        localStorage.setItem('token', token);
        setAccessToken(token);
        setIsAuthenticated(true);

        // Normalize roles array
        const normalizedRoles = Array.isArray(roles)
          ? roles
          : (roles ? [roles] : ['LEARNER']);

        const userInfo = {
          userId,
          username: uname,
          fullName: fullName || uname,
          roles: normalizedRoles,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);

        // Fetch profile in background
        fetchProfile();

        return { success: true, user: userInfo };
      }
      return { success: false, message: data?.message || 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: error?.message || 'Login failed. Please try again.' };
    }
  };

  // REGISTER: call API and auto-login if token is returned
  const register = async (payload) => {
    try {
      const data = await authApi.register(payload);
      if (data && data.code === 1000) {
        if (data.result?.token) {
          const { token, id, username: uname, email, fullName, nativeLanguage, targetLevel, roles } = data.result;
          localStorage.setItem('token', token);
          setAccessToken(token);
          setIsAuthenticated(true);
          const normalizedRoles = Array.isArray(roles) ? roles : (roles ? [roles] : ['LEARNER']);
          const userInfo = {
            id,
            userId: id,
            username: uname,
            email,
            fullName: fullName || uname,
            nativeLanguage,
            targetLevel,
            roles: normalizedRoles,
          };
          localStorage.setItem('user', JSON.stringify(userInfo));
          setUser(userInfo);
          fetchProfile();
          return { success: true, user: userInfo, data: data.result, message: data.message };
        }
        return { success: true, data: data.result, message: data.message };
      }
      return {
        success: false,
        code: data?.code,
        message: data?.message || 'Đăng ký không thành công.',
      };
    } catch (error) {
      const errData = error?.response?.data || error;
      return {
        success: false,
        code: errData?.code,
        message: errData?.message || error?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại.',
      };
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

        const normalizedRoles = Array.isArray(roles)
          ? roles
          : (roles ? [roles] : ['LEARNER']);

        const userInfo = {
          userId,
          username: uname,
          fullName: fullName || uname,
          roles: normalizedRoles,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);

        fetchProfile();

        return { success: true, user: userInfo };
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

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const isAdmin = hasRole('ADMIN');
  const isLearner = hasRole('LEARNER');

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
    isAdmin,
    isLearner,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
