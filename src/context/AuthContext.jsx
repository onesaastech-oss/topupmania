"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout as logoutUser, fetchUserProfile } from '@/lib/api/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const authenticated = isAuthenticated();
        const userData = getCurrentUser();
        
        setIsLoggedIn(authenticated);
        setUser(userData);
        
        // If authenticated, fetch fresh user profile data
        if (authenticated) {
          const profileResponse = await fetchUserProfile();
          if (profileResponse.success) {
            setUser(profileResponse.data);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    
    // Fetch fresh user profile data after login
    try {
      const profileResponse = await fetchUserProfile();
      if (profileResponse.success) {
        setUser(profileResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch user profile after login:', error);
      // Don't fail login if profile fetch fails, use provided userData
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsLoggedIn(false);
  };

  const refreshUserProfile = async () => {
    if (isLoggedIn) {
      try {
        const profileResponse = await fetchUserProfile();
        if (profileResponse.success) {
          setUser(profileResponse.data);
          return profileResponse.data;
        }
      } catch (error) {
        console.error('Failed to refresh user profile:', error);
      }
    }
    return null;
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
