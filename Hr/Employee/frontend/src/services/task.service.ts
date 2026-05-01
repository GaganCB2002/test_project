import api from './api';
import { Comment, Project, Task } from '@/types';

export const taskService = {
  async getTasks(filters?: {
    status?: string;
    priority?: string;
    assigned_to?: string;
    project?: string;
    search?: string;
  }): Promise<Task[]> {
    const response = await api.get('/tasks/', { params: filters });
    return response.data.results ?? response.data;
  },

  async getMyTasks(filters?: {
    status?: string;
    priority?: string;
  }): Promise<Task[]> {
    const response = await api.get('/tasks/my-tasks/', { params: filters });
    return response.data.results ?? response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },

  async createTask(data: {
    title: string;
    description: string;
    assigned_to: string;
    deadline: string;
    priority: string;
    project?: string;
    estimated_hours?: number;
  }): Promise<Task> {
    const response = await api.post('/tasks/', data);
    return response.data;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/`, data);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}/`);
  },

  async updateProgress(id: string, progress: number): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/progress/`, { progress_percentage: progress });
    return response.data.task ?? response.data;
  },

  async addComment(taskId: string, content: string): Promise<Comment> {
    const response = await api.post(`/tasks/${taskId}/comments/`, { content });
    return response.data;
  },

  async getProjects(status?: string): Promise<Project[]> {
    const response = await api.get('/tasks/projects/', { params: { status } });
    return response.data.results ?? response.data;
  },
};
