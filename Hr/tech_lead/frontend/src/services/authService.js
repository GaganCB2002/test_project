import axios from 'axios';

const demoCredentials = {
  email: 'techlead@company.com',
  password: 'password123',
  token: 'demo-techlead-token',
  user: {
    id: 'demo-techlead-user',
    name: 'Ava Thompson',
    email: 'techlead@company.com',
    role: 'TechLead',
    department: 'Engineering',
    status: 'online',
    skills: ['React', 'Node.js', 'Leadership', 'System Design'],
  },
};

const authApi = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const normalizeAuthResponse = (payload) => {
  const authData = payload?.data ?? payload;

  if (!authData?.user || !authData?.token) {
    throw new Error('Unexpected authentication response from server');
  }

  return authData;
};

export const authService = {
  async login(credentials) {
    try {
      const response = await authApi.post('/login', credentials);
      return normalizeAuthResponse(response.data);
    } catch (error) {
      const isDemoLogin =
        credentials.email?.trim().toLowerCase() === demoCredentials.email &&
        credentials.password === demoCredentials.password;

      if (!error.response && isDemoLogin) {
        return {
          user: demoCredentials.user,
          token: demoCredentials.token,
        };
      }

      throw error;
    }
  },

  async register(userData) {
    const response = await authApi.post('/register', userData);
    return response.data;
  },

  async logout() {
    try {
      await authApi.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getMe() {
    const response = await authApi.get('/me');
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await authApi.post('/change-password', passwordData);
    return response.data;
  },

  async refreshToken() {
    const response = await authApi.post('/refresh-token');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await authApi.post('/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await authApi.post(`/reset-password/${token}`, { password });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await authApi.post(`/verify-email/${token}`);
    return response.data;
  },
};

export default authService;
