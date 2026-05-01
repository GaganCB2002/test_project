import { create } from 'zustand';
import api from '../services/api';

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/workspaces');
      set({ workspaces: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  fetchWorkspace: async (id) => {
    set({ loading: true });
    try {
      const response = await api.get(`/workspaces/${id}`);
      set({ currentWorkspace: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
      return null;
    }
  },

  createWorkspace: async (data) => {
    set({ loading: true });
    try {
      const response = await api.post('/workspaces', data);
      set({ workspaces: [...get().workspaces, response.data], loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
      return null;
    }
  },

  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

  clearError: () => set({ error: null })
}));