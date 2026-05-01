import { api as apiService } from '../../shared/apiService'

export const employeeAPI = {
  getMyLeaves: (userId: string, token: string) => apiService.getMyLeaveRequests(userId, token),
  applyLeave: (data: any, token: string) => apiService.applyLeave(data, token),
}
