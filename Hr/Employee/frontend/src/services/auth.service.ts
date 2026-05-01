import api, { AUTH_API_URL } from './api';
import axios from 'axios';
import { User } from '@/types';

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  role: string;
  redirectUrl: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Call the Unified Auth Gateway (handled by Vite Proxy)
    const response = await axios.post(`/api/auth/login`, { email, password });
    const data = response.data;
    return {
      user: data.user,
      token: data.token,
      refreshToken: data.refreshToken, // May be undefined
      role: data.role,
      redirectUrl: data.redirectUrl
    };
  },

  async createEmployee(registerData: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    department: string;
    designation: string;
    role: 'EMPLOYEE' | 'ADMIN' | 'MANAGER' | 'HR';
    is_active?: boolean;
  }): Promise<User> {
    const response = await api.post('/accounts/register/', registerData);
    const respData = response.data;
    return respData.user ?? respData;
  },

  async getUsers(filters?: { role?: string; department?: string }): Promise<User[]> {
    const response = await api.get('/accounts/users/', { params: filters });
    return response.data.results ?? response.data;
  },

  async updateUser(id: string, data: Partial<User> & { role?: string }): Promise<User> {
    const response = await api.patch(`/accounts/users/${id}/`, data);
    return response.data;
  },

  async updateUserStatus(id: string, is_active: boolean): Promise<User> {
    const response = await api.patch(`/accounts/users/${id}/status/`, { is_active });
    return response.data.user ?? response.data;
  },

  async logout(): Promise<void> {
    try {
      const refresh = localStorage.getItem('refreshToken');
      await api.post('/accounts/logout/', { refresh });
    } catch {
      // Ignore logout errors
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get('/accounts/me/');
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<string> {
    const response = await api.post('/accounts/refresh/', { refresh: refreshToken });
    return response.data.access;
  },
};
