import api from './api';
import { IssueReport } from '@/types';

export const issuesService = {
  async getIssues(filters?: {
    status?: string;
    severity?: string;
    category?: string;
  }): Promise<IssueReport[]> {
    const response = await api.get('/issues/', { params: filters });
    return response.data.results ?? response.data;
  },

  async createIssue(data: {
    category: 'HR' | 'TECHNICAL' | 'PAYROLL' | 'LEAVE' | 'GENERAL';
    task?: string;
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }): Promise<IssueReport> {
    const response = await api.post('/issues/create/', data);
    return response.data.issue ?? response.data;
  },

  async updateIssue(id: string, data: Partial<IssueReport>): Promise<IssueReport> {
    const response = await api.patch(`/issues/${id}/update/`, data);
    return response.data.issue ?? response.data;
  },
};
