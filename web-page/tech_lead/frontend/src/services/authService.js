import api from './api';

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
      const response = await api.post('/auth/login', credentials);
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
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  },
};

export default authService;
