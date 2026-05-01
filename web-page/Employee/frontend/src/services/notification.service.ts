import api from './api';
import { Notification } from '@/types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications/');
    return response.data.results ?? response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read/`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all/');
  },
};
