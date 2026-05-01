import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjectsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProjectsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    setProjectsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addProject: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.items.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.current && state.current._id === action.payload._id) {
        state.current = action.payload;
      }
    },
    removeProject: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
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
  },
});

export const {
  setProjectsStart,
  setProjectsSuccess,
  setProjectsFailure,
  addProject,
  updateProject,
  removeProject,
  setCurrent,
  clearCurrent,
} = projectSlice.actions;

export default projectSlice.reducer;
