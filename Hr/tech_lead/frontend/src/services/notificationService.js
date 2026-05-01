import api from './api';

export const notificationService = {
  async getNotifications(params = {}) {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  async deleteAllNotifications() {
    const response = await api.delete('/notifications');
    return response.data;
  },

  async getNotificationSettings() {
    const response = await api.get('/notifications/settings');
    return response.data;
  },

  async updateNotificationSettings(settings) {
    const response = await api.put('/notifications/settings', settings);
    return response.data;
  },
};

export default notificationService;
