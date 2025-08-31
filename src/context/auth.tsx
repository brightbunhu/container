"use client";

import type { User } from '@/lib/types';
import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  users: User[];
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: User['role'][]) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData.user);
        return true;
      } else {
        console.error('Login failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    // You could also clear any stored tokens here
  };

  const hasRole = (roles: User['role'][]) => {
    if (!currentUser || !Array.isArray(roles)) {
      return false;
    }
    return roles.includes(currentUser.role);
  };

  const contextValue = useMemo(() => ({
    user: currentUser,
    users,
    setUser: setCurrentUser,
    login,
    logout,
    hasRole,
    loading,
  }), [currentUser, users, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
