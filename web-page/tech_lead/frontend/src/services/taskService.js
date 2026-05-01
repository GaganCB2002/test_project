import api from './api';

export const taskService = {
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async assignTask(id, userId) {
    const response = await api.patch(`/tasks/${id}/assign`, { userId });
    return response.data;
  },

  async unassignTask(id) {
    const response = await api.patch(`/tasks/${id}/unassign`);
    return response.data;
  },

  async addComment(taskId, comment) {
    const response = await api.post(`/tasks/${taskId}/comments`, { content: comment });
    return response.data;
  },

  async getTaskComments(taskId) {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  async deleteComment(taskId, commentId) {
    const response = await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    return response.data;
  },

  async addAttachment(taskId, formData) {
    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getTaskAttachments(taskId) {
    const response = await api.get(`/tasks/${taskId}/attachments`);
    return response.data;
  },

  async deleteAttachment(taskId, attachmentId) {
    const response = await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return response.data;
  },

  async getTaskActivity(taskId) {
    const response = await api.get(`/tasks/${taskId}/activity`);
    return response.data;
  },

  async getMyTasks(params = {}) {
    const response = await api.get('/tasks/my-tasks', { params });
    return response.data;
  },

  async getTasksByStatus(status, params = {}) {
    const response = await api.get(`/tasks/status/${status}`, { params });
    return response.data;
  },
};

export default taskService;
