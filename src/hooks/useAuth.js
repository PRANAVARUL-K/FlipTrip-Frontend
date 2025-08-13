import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(() => {
    const authStatus = apiService.isAuthenticated();
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      const userData = apiService.getCurrentUser();
      setUser(userData);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const result = await apiService.loginUser(credentials);
      
      // Store auth data in cookies
      apiService.storeAuthData(result.data, credentials.remember_me);
      
      // Update state
      const userData = apiService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      
      return result;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const result = await apiService.registerUser(userData);
      
      // Store auth data in cookies
      apiService.storeAuthData(result.data, userData.remember_me);
      
      // Update state
      const userDataFromCookie = apiService.getCurrentUser();
      setUser(userDataFromCookie);
      setIsAuthenticated(true);
      
      return result;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const extendSession = useCallback(async (days = 7) => {
    try {
      const result = await apiService.extendSession(days);
      
      // Update cookie expiry
      const currentUser = apiService.getCurrentUser();
      if (currentUser) {
        apiService.setCookie('sessionExpiry', result.data.new_expiry, days);
      }
      
      return result;
    } catch (error) {
      console.error('Session extension error:', error);
      throw error;
    }
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    extendSession,
    checkAuthStatus
  };
};