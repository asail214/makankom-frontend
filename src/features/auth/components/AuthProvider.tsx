import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext, type AuthContextType, type AuthUser } from '../context/AuthContext';
import type { UserRole } from '../../../types/models';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userType, setUserType] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on mount
    const storedToken = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType') as UserRole;
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUserType && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUserType(storedUserType);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser, role: UserRole, authToken: string) => {
    setUser(userData);
    setUserType(role);
    setToken(authToken);
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('userType', role);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setToken(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    userType,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};