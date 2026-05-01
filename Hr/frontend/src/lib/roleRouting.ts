const PORTAL_ORIGIN = 'http://127.0.0.1:3005'
const CEO_CONSOLE_ORIGIN = 'http://127.0.0.1:3001'
const EMPLOYEE_APP_ORIGIN = 'http://127.0.0.1:5173'
const TECH_LEAD_APP_ORIGIN = 'http://127.0.0.1:3003'
const HELPDESK_APP_ORIGIN = 'http://127.0.0.1:3004'

export type NormalizedRole =
  | 'CEO'
  | 'ADMIN'
  | 'HR'
  | 'EMPLOYEE'
  | 'MANAGER'
  | 'TECH_LEAD'
  | 'MARKETING'
  | 'UNKNOWN'

export interface RoleDestination {
  kind: 'internal' | 'external'
  path: string
  url: string
}

function withToken(url: string, token?: string | null) {
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

export function canAccessSelectedRole(actualRole?: string | null, requestedRole?: string | null) {
  const actual = normalizeRole(actualRole)
  const requested = normalizeRole(requestedRole)

  if (actual === requested) return true

  return (
    (actual === 'CEO' || actual === 'ADMIN') &&
    (requested === 'CEO' || requested === 'ADMIN')
  )
}

export function getRoleDestination(role?: string | null, token?: string | null): RoleDestination {
  const normalized = normalizeRole(role)

  if (normalized === 'EMPLOYEE') {
    const url = withToken(`${EMPLOYEE_APP_ORIGIN}/dashboard`, token)
    return { kind: 'external', path: '/dashboard', url }
  }

  if (normalized === 'TECH_LEAD') {
    const url = withToken(`${TECH_LEAD_APP_ORIGIN}/dashboard`, token)
    return { kind: 'external', path: '/dashboard', url }
  }

  if (normalized === 'CEO' || normalized === 'ADMIN') {
    const url = withToken(CEO_CONSOLE_ORIGIN, token)
    return { kind: 'external', path: '/dashboard', url }
  }

  if (normalized === 'HR') {
    return { kind: 'internal', path: '/hr-dashboard', url: `${PORTAL_ORIGIN}/hr-dashboard` }
  }

  if (normalized === 'MANAGER') {
    return { kind: 'internal', path: '/manager-dashboard', url: `${PORTAL_ORIGIN}/manager-dashboard` }
  }

  if (normalized === 'MARKETING') {
    return { kind: 'internal', path: '/marketing-hub', url: `${PORTAL_ORIGIN}/marketing-hub` }
  }

  return { kind: 'internal', path: '/dashboard', url: `${PORTAL_ORIGIN}/dashboard` }
}

export function isGenericEntryRoute(pathname: string) {
  return ['/', '/login', '/dashboard', '/employee-dashboard', '/manager-dashboard', '/techlead-dashboard'].includes(pathname)
}

export function getModuleUrl(module: 'ceo' | 'hr' | 'employee' | 'tech' | 'helpdesk', token?: string | null) {
  if (module === 'ceo') return withToken(CEO_CONSOLE_ORIGIN, token)
  if (module === 'employee') return withToken(`${EMPLOYEE_APP_ORIGIN}/dashboard`, token)
  if (module === 'tech') return withToken(`${TECH_LEAD_APP_ORIGIN}/dashboard`, token)
  if (module === 'helpdesk') return withToken(HELPDESK_APP_ORIGIN, token)
  return `${PORTAL_ORIGIN}/hr-dashboard`
}
