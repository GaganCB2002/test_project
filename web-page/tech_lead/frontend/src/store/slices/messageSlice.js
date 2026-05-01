import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRoom: null,
  items: [],
  typingUsers: [],
  loading: false,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
      state.items = [];
      state.typingUsers = [];
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
      state.items = [];
      state.typingUsers = [];
    },
    addMessage: (state, action) => {
      state.items.push(action.payload);
      if (state.items.length > 500) {
        state.items = state.items.slice(-500);
      }
    },
    setMessages: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    setMessagesLoading: (state) => {
      state.loading = true;
    },
    clearMessages: (state) => {
      state.items = [];
    },
    setTypingUser: (state, action) => {
      const { roomId, userId, username } = action.payload;
      if (state.currentRoom === roomId) {
        const exists = state.typingUsers.some((u) => u.userId === userId);
        if (!exists) {
          state.typingUsers.push({ userId, username });
        }
      }
    },
    removeTypingUser: (state, action) => {
      const { roomId, userId } = action.payload;
      if (state.currentRoom === roomId) {
        state.typingUsers = state.typingUsers.filter((u) => u.userId !== userId);
      }
    },
    clearTypingUsers: (state) => {
      state.typingUsers = [];
    },
  },
});

export const {
  setCurrentRoom,
  clearCurrentRoom,
  addMessage,
  setMessages,
  setMessagesLoading,
  clearMessages,
  setTypingUser,
  removeTypingUser,
  clearTypingUsers,
} = messageSlice.actions;

export default messageSlice.reducer;
