import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    addNotification: (state, action) => {
      const notification = {
        _id: Date.now() + Math.random(),
        read: false,
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.items.unshift(notification);
      state.unreadCount += 1;
      if (state.items.length > 100) {
        state.items = state.items.slice(0, 100);
      }
    },
    markAsRead: (state, action) => {
      const notification = state.items.find((n) => n._id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const index = state.items.findIndex((n) => n._id === action.payload);
      if (index !== -1) {
        if (!state.items[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items.splice(index, 1);
      }
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setUnreadCount,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
