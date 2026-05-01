import api from './api';

export const userService = {
  async getUsers(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async getUserTasks(id, params = {}) {
    const response = await api.get(`/users/${id}/tasks`, { params });
    return response.data;
  },

  async getUserProjects(id, params = {}) {
    const response = await api.get(`/users/${id}/projects`, { params });
    return response.data;
  },

  async updateUserAvatar(id, formData) {
    const response = await api.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getUserStats(id) {
    const response = await api.get(`/users/${id}/stats`);
    return response.data;
  },

  async searchUsers(query) {
    const response = await api.get('/users/search', { params: { q: query } });
    return response.data;
  },
};

export default userService;
