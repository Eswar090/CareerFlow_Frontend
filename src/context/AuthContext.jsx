import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careerflow_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Authentication check failed", error);
          authService.logout();
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('careerflow_token', data.token);
    localStorage.setItem('careerflow_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    localStorage.setItem('careerflow_token', data.token);
    localStorage.setItem('careerflow_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="flex h-screen items-center justify-center">Loading authentication state...</div>}
    </AuthContext.Provider>
  );
};

