import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sevasetu_user') || localStorage.getItem('sevaqueue_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sevasetu_token') || localStorage.getItem('sevaqueue_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('sevasetu_token') || localStorage.getItem('sevaqueue_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('sevasetu_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token invalid or expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('sevasetu_token');
          localStorage.removeItem('sevasetu_user');
          localStorage.removeItem('sevaqueue_token');
          localStorage.removeItem('sevaqueue_user');
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('sevasetu_token', res.data.token);
      localStorage.setItem('sevasetu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (fullName, email, password, confirmPassword) => {
    const res = await authService.register(fullName, email, password, confirmPassword);
    if (res.data.success && res.data.token) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('sevasetu_token', res.data.token);
      localStorage.setItem('sevasetu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('sevasetu_token');
      localStorage.removeItem('sevasetu_user');
      localStorage.removeItem('sevaqueue_token');
      localStorage.removeItem('sevaqueue_user');
    }
  };

  const isAdmin = user && user.role === 'admin';
  const isObserver = user && (user.role === 'observer' || user.role === 'admin');
  const isCitizen = user && (user.role === 'citizen' || !user.role);
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isObserver,
        isCitizen,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
