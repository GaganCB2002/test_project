import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { Role, User } from '../../types'
import { normalizeRole } from '../../lib/roleRouting'

interface ProtectedRouteProps {
  user: User | null
  allowedRoles: Role[]
  children: ReactNode
}

export function ProtectedRoute({ user, allowedRoles, children }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Check if user role is in the allowed list (case-insensitive)
  const userRole = normalizeRole(user.role)
  const isAllowed = allowedRoles.some((role) => normalizeRole(role) === userRole)

  if (!isAllowed) {
    // If not allowed, redirect to their primary dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
