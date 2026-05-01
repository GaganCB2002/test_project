import type { HierarchyNode, PlatformData, User } from '../types'

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

  createLeaveRequest(
    payload: {
      employeeId: string
      employeeName: string
      type: string
      from: string
      to: string
      reason: string
    },
    token: string,
  ) {
    return request('/api/attendance/leave-requests', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  },

  getAISuggestion(employeeId: string, from: string, to: string, token: string) {
    return request<{ suggestion: string }>(`/api/ai/leave-suggestion?employeeId=${employeeId}&from=${from}&to=${to}`, { token })
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
}
