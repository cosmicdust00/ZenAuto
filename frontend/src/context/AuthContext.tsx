import React, { createContext, useContext, useState } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  updateProfileState: (updated: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('za_token');
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('za_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Error parsing user data from localStorage", e);
      return null;
    }
  });

  const login = (newToken: string, userData: UserProfile) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('za_token', newToken);
    localStorage.setItem('za_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('za_token');
    localStorage.removeItem('za_user');
  };

  const updateProfileState = (updated: Partial<UserProfile>) => {
    if (user) {
      const nextUser = { ...user, ...updated };
      setUser(nextUser);
      localStorage.setItem('za_user', JSON.stringify(nextUser));
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateProfileState, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};