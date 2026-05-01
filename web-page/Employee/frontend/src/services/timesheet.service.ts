import api from './api';
import { BreakSession, TimeSheet, TimeTrackingSummary, WorkSession } from '@/types';

export interface WeeklySummary {
  user: string;
  week_start: string;
  week_end: string;
  total_minutes: number;
  total_hours: number;
  total_break_minutes: number;
  days_logged: number;
  daily_breakdown: {
    date: string;
    day_name: string;
    minutes: number;
    hours: number;
    break_minutes: number;
  }[];
}

export interface TodayTimeSheetResponse {
  date: string;
  entries: TimeSheet[];
  work_session: WorkSession | null;
  total_minutes: number;
  total_hours: number;
}

export const timesheetService = {
  async getTimeSheets(date?: string): Promise<TimeSheet[]> {
    const response = await api.get('/timesheet/', { params: { date } });
    return response.data.results ?? response.data;
  },

  async createTimeSheet(data: {
    task?: string;
    date: string;
    start_time: string;
    end_time: string;
    description: string;
  }): Promise<TimeSheet> {
    const response = await api.post('/timesheet/create/', data);
    return response.data.timesheet ?? response.data;
  },

  async updateTimeSheet(id: string, data: Partial<TimeSheet>): Promise<TimeSheet> {
    const response = await api.patch(`/timesheet/${id}/`, data);
    return response.data.timesheet ?? response.data;
  },

  async getWeeklySummary(weekOffset = 0): Promise<WeeklySummary> {
    const response = await api.get('/timesheet/weekly-summary/', {
      params: { week: weekOffset }
    });
    return response.data;
  },

  async getTodayTimeSheet(): Promise<TodayTimeSheetResponse> {
    const response = await api.get('/timesheet/today/');
    return response.data;
  },

  async getCurrentSession(): Promise<WorkSession | null> {
    const response = await api.get('/timesheet/session/current/');
    return response.data.session ?? null;
  },

  async startBreak(): Promise<{ break_session: BreakSession; session: WorkSession }> {
    const response = await api.post('/timesheet/session/start-break/');
    return response.data;
  },

  async endBreak(): Promise<{ break_session: BreakSession; session: WorkSession }> {
    const response = await api.post('/timesheet/session/end-break/');
    return response.data;
  },

  async getSummary(period: 'daily' | 'weekly' | 'monthly'): Promise<TimeTrackingSummary> {
    const response = await api.get('/timesheet/summary/', { params: { period } });
    return response.data;
  },
};
