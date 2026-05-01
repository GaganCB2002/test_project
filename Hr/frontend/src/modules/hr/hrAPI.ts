import { api as apiService } from '../../shared/apiService'

export const hrAPI = {
  getDashboardIntel: (token: string) => apiService.getAllLeaveRequests(token),
  getAllLeaves: (token: string) => apiService.getAllLeaveRequests(token),
  approveLeave: (id: string, token: string) => apiService.approveLeave(id, token),
  rejectLeave: (id: string, reason: string, token: string) => apiService.rejectLeave(id, reason, token),
  getRecruitmentData: (token: string) => apiService.getAllLeaveRequests(token), // Placeholder for actual recruitment API
}
