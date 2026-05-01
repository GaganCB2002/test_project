import api from './api';
import { PerformanceMetrics } from '@/types';

export const performanceService = {
  async getDashboardMetrics(): Promise<PerformanceMetrics> {
    const response = await api.get('/performance/dashboard/');
    return response.data;
  },
};
