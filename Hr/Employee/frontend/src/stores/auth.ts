import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null, refreshToken?: string | null | undefined) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  login: (user: User, token: string, refreshToken?: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true,
  setUser: (user) => set({ user }),
  setToken: (token, refreshToken) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (refreshToken !== undefined && refreshToken !== null) {
      localStorage.setItem('refreshToken', refreshToken);
    } else if (refreshToken === null) {
      localStorage.removeItem('refreshToken');
    }
    set((state) => ({
      token,
      refreshToken: refreshToken === undefined ? state.refreshToken : refreshToken,
      isAuthenticated: !!token,
    }));
  },
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },
  login: (user, token, refreshToken) => {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
  },
}));
