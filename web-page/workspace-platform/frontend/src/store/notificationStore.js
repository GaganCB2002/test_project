import { create } from 'zustand';
import api from '../services/api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/notifications');
      set({
        notifications: response.data.notifications,
        unreadCount: response.data.unreadCount,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      const notifications = get().notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      );
      set({
        notifications,
        unreadCount: Math.max(0, get().unreadCount - 1)
      });
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  },

  markAllAsRead: async () => {
    try {
      await api.put('/notifications/read-all');
      const notifications = get().notifications.map(n => ({ ...n, isRead: true }));
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all notifications as read');
    }
  },

  addNotification: (notification) => {
    set({
      notifications: [notification, ...get().notifications],
      unreadCount: get().unreadCount + 1
    });
  }
}));