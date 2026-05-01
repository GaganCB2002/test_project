import api from './api';

export const projectService = {
  async getProjects(params = {}) {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  async getProject(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(projectData) {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  async updateProject(id, projectData) {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  async addMember(projectId, memberId, role = 'member') {
    const response = await api.post(`/projects/${projectId}/members`, {
      userId: memberId,
      role,
    });
    return response.data;
  },

  async removeMember(projectId, memberId) {
    const response = await api.delete(`/projects/${projectId}/members/${memberId}`);
    return response.data;
  },

  async updateMemberRole(projectId, memberId, role) {
    const response = await api.put(`/projects/${projectId}/members/${memberId}`, {
      role,
    });
    return response.data;
  },

  async updateProgress(id, progress) {
    const response = await api.patch(`/projects/${id}/progress`, { progress });
    return response.data;
  },

  async getProjectTasks(id, params = {}) {
    const response = await api.get(`/projects/${id}/tasks`, { params });
    return response.data;
  },

  async getProjectMembers(id) {
    const response = await api.get(`/projects/${id}/members`);
    return response.data;
  },

  async getProjectStats(id) {
    const response = await api.get(`/projects/${id}/stats`);
    return response.data;
  },

  async uploadProjectFile(id, formData) {
    const response = await api.post(`/projects/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getProjectFiles(id) {
    const response = await api.get(`/projects/${id}/files`);
    return response.data;
  },
};

export default projectService;
