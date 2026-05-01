import api from './api';
import { Attendance, AttendanceStats, LeaveRequest } from '@/types';

export interface LeaveBalance {
  sick_leave_used: number;
  sick_leave_remaining: number;
  casual_leave_used: number;
  casual_leave_remaining: number;
  annual_leave_used: number;
  annual_leave_remaining: number;
  unpaid_leave_used: number;
}

export const attendanceService = {
  async getAttendanceList(filters?: { date_from?: string; date_to?: string; status?: string }): Promise<Attendance[]> {
    const response = await api.get('/attendance/', { params: filters });
    return response.data.results ?? response.data;
  },

  async login(): Promise<Attendance> {
    const response = await api.post('/attendance/login/');
    return response.data.attendance ?? response.data;
  },

  async logout(): Promise<Attendance> {
    const response = await api.post('/attendance/logout/');
    return response.data.attendance ?? response.data;
  },

  async getTodayAttendance(): Promise<Attendance | null> {
    const response = await api.get('/attendance/today/');
    return response.data.id ? response.data : null;
  },

  async getAttendanceStats(month: number, year: number): Promise<AttendanceStats> {
    const response = await api.get('/attendance/stats/', { params: { month, year } });
    return response.data;
  },

  async getLeaveRequests(status?: string): Promise<LeaveRequest[]> {
    const response = await api.get('/attendance/leaves/', { params: { status } });
    return response.data.results ?? response.data;
  },

  async createLeaveRequest(data: {
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
  }): Promise<LeaveRequest> {
    const response = await api.post('/attendance/leaves/', data);
    return response.data.leave_request ?? response.data;
  },

  async getLeaveBalance(): Promise<LeaveBalance> {
    const response = await api.get('/attendance/leaves/balance/');
    return response.data;
  },
};
