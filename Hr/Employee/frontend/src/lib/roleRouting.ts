export type NormalizedRole =
  | 'CEO'
  | 'ADMIN'
  | 'HR'
  | 'EMPLOYEE'
  | 'MANAGER'
  | 'TECH_LEAD'
  | 'MARKETING'
  | 'UNKNOWN'

function appendToken(url: string, token?: string | null) {
  if (!token) return url

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}token=${encodeURIComponent(token)}`
}

export function normalizeRole(role?: string | null): NormalizedRole {
  const value = (role ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_')

  if (!value) return 'UNKNOWN'
  if (value === 'LEAD' || value === 'TECHLEAD' || value === 'TECH_LEAD') return 'TECH_LEAD'
  if (value === 'EMPLOYEE') return 'EMPLOYEE'
  if (value === 'MANAGER') return 'MANAGER'
  if (value === 'HR') return 'HR'
  if (value === 'MARKETING') return 'MARKETING'
  if (value === 'ADMIN') return 'ADMIN'
  if (value === 'CEO') return 'CEO'

  return 'UNKNOWN'
}

export function getRoleFromToken(token?: string | null) {
  if (!token) return 'UNKNOWN'

  try {
    const [, payload] = token.split('.')
    if (!payload) return 'UNKNOWN'

    const decoded = JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return normalizeRole(decoded.role)
  } catch {
    return 'UNKNOWN'
  }
}

export function getRoleDestination(role?: string | null, token?: string | null) {
  const normalized = normalizeRole(role)

  if (normalized === 'CEO' || normalized === 'ADMIN') {
    return appendToken('http://127.0.0.1:3001', token)
  }

  if (normalized === 'HR') {
    return appendToken('http://127.0.0.1:3005/hr-dashboard', token)
  }

  if (normalized === 'MANAGER') {
    return appendToken('http://127.0.0.1:3005/manager-dashboard', token)
  }

  if (normalized === 'TECH_LEAD') {
    return appendToken('http://127.0.0.1:3003/dashboard', token)
  }

  if (normalized === 'MARKETING') {
    return appendToken('http://127.0.0.1:3005/marketing-hub', token)
  }

  return appendToken('http://127.0.0.1:5173/dashboard', token)
}
