'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, LoginUserInput, RegisterUserInput } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginUserInput) => Promise<void>;
  register: (input: RegisterUserInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  preservedAction: unknown;
  setPreservedAction: (action: unknown) => void;
  clearPreservedAction: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preservedAction, setPreservedActionState] = useState<unknown>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('prasang_user_profile', JSON.stringify(data.user));
      }
    } catch {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('prasang_user_profile');
      }
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('prasang_user_access_token');
        const savedUser = localStorage.getItem('prasang_user_profile');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            // Ignore parse error
          }
        }
        if (token) {
          try {
            await refreshProfile();
          } catch {
            // Token may have expired or offline
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshProfile]);

  const login = async (input: LoginUserInput) => {
    setIsLoading(true);
    try {
      const result = await authService.loginUser(input);
      if (typeof window !== 'undefined') {
        localStorage.setItem('prasang_user_access_token', result.tokens.accessToken);
        localStorage.setItem('prasang_user_refresh_token', result.tokens.refreshToken);
        localStorage.setItem('prasang_user_profile', JSON.stringify(result.user));
      }
      setUser(result.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterUserInput) => {
    setIsLoading(true);
    try {
      const result = await authService.registerUser(input);
      if (typeof window !== 'undefined') {
        localStorage.setItem('prasang_user_access_token', result.tokens.accessToken);
        localStorage.setItem('prasang_user_refresh_token', result.tokens.refreshToken);
        localStorage.setItem('prasang_user_profile', JSON.stringify(result.user));
      }
      setUser(result.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setPreservedActionState(null);
      setIsLoading(false);
    }
  };

  const setPreservedAction = (action: unknown) => {
    setPreservedActionState(action);
  };

  const clearPreservedAction = () => {
    setPreservedActionState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        preservedAction,
        setPreservedAction,
        clearPreservedAction,
      }}
    >
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
