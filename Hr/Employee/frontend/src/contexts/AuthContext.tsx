import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth';
import { User } from '@/types';
import { getRoleDestination, getRoleFromToken, normalizeRole } from '@/lib/roleRouting';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createEmployee: (data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    department: string;
    designation: string;
    role: 'EMPLOYEE' | 'ADMIN' | 'MANAGER' | 'HR';
    is_active?: boolean;
  }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const {
    user,
    setUser,
    login: storeLogin,
    logout: storeLogout,
    token,
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    // 1. Check for token transfer from Unified Portal (token passed in URL)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      useAuthStore.getState().setToken(urlToken);
      // Remove token from URL to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const initAuth = async () => {
      // Re-fetch token from store as it might have been set by URL check above
      const currentToken = useAuthStore.getState().token;
      if (!currentToken) {
        setIsLoading(false);
        return;
      }
      try {
        const tokenRole = getRoleFromToken(currentToken);

        if (tokenRole !== 'UNKNOWN' && tokenRole !== 'EMPLOYEE') {
          window.location.assign(getRoleDestination(tokenRole, currentToken));
          return;
        }

        const userData = await authService.getMe();
        const role = normalizeRole(userData.role || tokenRole);

        if (role !== 'EMPLOYEE') {
          window.location.assign(getRoleDestination(role, currentToken));
          return;
        }

        setUser(userData);
      } catch {
        storeLogout();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [setUser, storeLogout]);

  const login = async (email: string, password: string) => {
    console.log(`[AUTH] Sending login request for: ${email}`);
    console.log(`[AUTH] Credentials used: ${email} / ${password}`); 
    const response = await authService.login(email, password);
    console.log("[AUTH] Full Login Response:", response);

    const role = normalizeRole(response.role || response.user?.role);
    if (role !== 'EMPLOYEE') {
      window.location.assign(getRoleDestination(role, response.token));
      return;
    }

    storeLogin(response.user, response.token, response.refreshToken || '');
    setUser(response.user);
  };

  const logout = async () => {
    try {
      if (user && token) {
        await fetch('/api/location/session/stop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            employeeId: user.employeeId || user.id,
            name: user.name,
          }),
        }).catch(() => undefined);
      }
      await authService.logout();
    } finally {
      storeLogout();
      setUser(null);
    }
  };

  const createEmployee = async (data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    department: string;
    designation: string;
    role: 'EMPLOYEE' | 'ADMIN' | 'MANAGER' | 'HR';
    is_active?: boolean;
  }) => {
    return authService.createEmployee(data);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, logout, createEmployee }}>
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
