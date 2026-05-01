import api from './api';
import { UploadedFile } from '@/types';

export const fileService = {
  async getFiles(relatedTask?: string): Promise<UploadedFile[]> {
    const response = await api.get('/files/', { params: { task: relatedTask } });
    return response.data.results ?? response.data;
  },

  async uploadFile(file: globalThis.File, relatedTask?: string): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    if (relatedTask) {
      formData.append('related_task', relatedTask);
    }
    const response = await api.post('/files/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.file ?? response.data;
  },

  async deleteFile(id: string): Promise<void> {
    await api.delete(`/files/${id}/delete/`);
  },
};
