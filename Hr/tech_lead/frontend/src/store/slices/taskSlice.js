import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTasksSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    setTasksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTask: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.items.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.current && state.current._id === action.payload._id) {
        state.current = action.payload;
      }
    },
    removeTask: (state, action) => {
      state.items = state.items.filter((t) => t._id !== action.payload);
      if (state.current && state.current._id === action.payload) {
        state.current = null;
      }
    },
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.items.find((t) => t._id === id);
      if (task) {
        task.status = status;
      }
      if (state.current && state.current._id === id) {
        state.current.status = status;
      }
    },
  },
});

export const {
  setTasksStart,
  setTasksSuccess,
  setTasksFailure,
  addTask,
  updateTask,
  removeTask,
  setCurrent,
  clearCurrent,
  updateTaskStatus,
} = taskSlice.actions;

export default taskSlice.reducer;
