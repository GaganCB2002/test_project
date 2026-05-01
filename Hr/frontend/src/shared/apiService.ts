import axios from 'axios'
import type { HierarchyNode, PlatformData, User } from '../types'

const PG_BASE = '/api'

type RequestOptions = RequestInit & {
  token?: string
}

export const API_URL = ''

async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed.' }))
    throw new Error(error.message ?? 'Request failed.')
  }

  return (await response.json()) as T
}

export const api = {
  login(email: string, password: string) {
    return request<{ token: string; user: User; role: string; redirectUrl: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  getMe(token: string) {
    return request<User>('/api/auth/me', { token })
  },

  getPlatform(token: string) {
    return request<PlatformData>('/api/platform', { token })
  },

  getHierarchyRoot(token: string) {
    return request<HierarchyNode>('/api/hierarchy/root', { token })
  },

  getHierarchyChildren(employeeId: string, token: string) {
    return request<HierarchyNode[]>(`/api/hierarchy/${employeeId}/children`, { token })
  },

  updateCandidateStage(candidateId: string, stage: string, token: string) {
    return request(`/api/recruitment/candidates/${candidateId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ stage }),
    })
  },

  getAISuggestion(employeeId: string, from: string, to: string, token: string) {
    return request<{ suggestion: string }>(`/api/ai/leave-suggestion?employeeId=${employeeId}&from=${from}&to=${to}`, { token })
  },

  // Legacy leave requests removed in favor of enterprise PG implementation below

  createLeaveRequest(payload: any, token: string) {
    return request('/api/leave/apply', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  },

  approveLeaveRequest(id: string, token: string) {
    return request(`/api/leave/approve/${id}`, {
      method: 'POST',
      token,
    })
  },

  rejectLeaveRequest(id: string, reason: string, token: string) {
    return request(`/api/leave/reject/${id}`, {
      method: 'POST',
      token,
      body: JSON.stringify({ reason }),
    })
  },

  uploadLeaveDocument(id: string, documentUrl: string, token: string) {
    return request('/api/leave/upload-document', {
      method: 'POST',
      token,
      body: JSON.stringify({ id, documentUrl }),
    })
  },

  getAllocations(token: string) {
    return request<any[]>('/api/allocation', { token })
  },

  createAllocation(payload: any, token: string) {
    return request('/api/allocation', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  },

  getChatMessages(token: string, otherId?: string, groupId?: string) {
    const params = new URLSearchParams()
    if (otherId) params.append('otherId', otherId)
    if (groupId) params.append('groupId', groupId)
    return request<any[]>(`/api/chat/messages?${params}`, { token })
  },

  sendMessage(payload: any, token: string) {
    return request('/api/chat/messages', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  },

  updatePayroll(employeeId: string, payload: any, token: string) {
    return request(`/api/payroll/${employeeId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    })
  },

  processPayroll(month: string, token: string) {
    return request('/api/payroll/process', {
      method: 'POST',
      token,
      body: JSON.stringify({ month }),
    })
  },

  getAssets(token: string) {
    return request<any[]>('/api/assets', { token })
  },

  getAssetAllocations(token: string) {
    return request<any[]>('/api/assets/allocations', { token })
  },

  addAsset(payload: any, token: string) {
    return request('/api/assets', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  },

  allocateAsset(payload: any, token: string) {
    return request('/api/assets/allocate', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  },

  revokeAsset(id: string, token: string) {
    return request(`/api/assets/revoke/${id}`, {
      method: 'POST',
      token,
    })
  },

  updateProfile(payload: { name?: string; email?: string }, token: string) {
    return request<User>('/api/me', {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    })
  },

  getInbox(token: string) {
    return request<any[]>('/api/mail/inbox', { token })
  },

  sendMail(payload: { receiverId: string; subject: string; body: string }, token: string) {
    return request('/api/mail/send', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  },

  // --- 🏗️ PROJECT MANAGEMENT (PostgreSQL Upgrade) ---
  async applyLeave(data: any, token: string) {
    const res = await axios.post(`${PG_BASE}/leave/apply`, data, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async getMyLeaveRequests(employeeId: string, token: string) {
    const res = await axios.get(`${PG_BASE}/leave/my-requests?employeeId=${employeeId}`, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async getAllLeaveRequests(token: string) {
    const res = await axios.get(`${PG_BASE}/leave/all`, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async approveLeave(id: string, token: string) {
    const res = await axios.post(`${PG_BASE}/leave/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async rejectLeave(id: string, reason: string, token: string) {
    const res = await axios.post(`${PG_BASE}/leave/reject/${id}`, { reason }, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async getProjects(token: string): Promise<any[]> {
    const res = await axios.get(`${PG_BASE}/projects`, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async getProjectById(id: string, token: string): Promise<any> {
    const res = await axios.get(`${PG_BASE}/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async getProjectEmployees(id: string, token: string): Promise<any[]> {
    const res = await axios.get(`${PG_BASE}/projects/${id}/employees`, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async getProjectFiles(id: string, token: string): Promise<any[]> {
    const res = await axios.get(`${PG_BASE}/projects/${id}/files`, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async assignEmployeeToProject(projectId: string, employeeId: string, token: string): Promise<any> {
    const res = await axios.post(`${PG_BASE}/projects/${projectId}/assign-employee`, { employeeId }, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },

  async uploadProjectFile(projectId: string, file: File, type: string, uploadedBy: string, token: string): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', type)
    formData.append('uploadedBy', uploadedBy)
    formData.append('projectId', projectId)
    const res = await axios.post(`${PG_BASE}/projects/${projectId}/upload-file`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}` 
      }
    })
    return res.data
  },

  async getAllEmployees(token: string): Promise<any[]> {
    const res = await axios.get(`${PG_BASE}/employees`, { headers: { Authorization: `Bearer ${token}` } })
    return res.data
  },
}
