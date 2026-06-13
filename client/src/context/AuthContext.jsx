import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const { data } = await api.get('/auth/profile');
          setUser(data);
        } catch (error) {
          console.error("Auth token invalid", error);
          localStorage.removeItem('adminToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('adminToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
