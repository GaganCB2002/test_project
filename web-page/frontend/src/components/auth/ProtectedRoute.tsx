import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { Role, User } from '../../types'

interface ProtectedRouteProps {
  user: User | null
  allowedRoles: Role[]
  children: ReactNode
}

export function ProtectedRoute({ user, allowedRoles, children }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user role is in the allowed list (case-insensitive)
  const isAllowed = allowedRoles.some(
    (role) => role.toLowerCase() === user?.role?.toLowerCase()
  )

  if (!isAllowed) {
    // If not allowed, redirect to their primary dashboard
    const userRole = (user?.role || '').toUpperCase()
    const path = userRole === 'HR' ? '/hr-dashboard' :
                 userRole === 'EMPLOYEE' ? '/employee-dashboard' :
                 userRole === 'MANAGER' ? '/manager-dashboard' :
                 (userRole === 'TECH_LEAD' || userRole === 'LEAD') ? '/teamlead-dashboard' :
                 userRole === 'MARKETING' ? '/marketing-hub' :
                 userRole === 'IT' ? '/help-desk' :
                 (userRole === 'ADMIN' || userRole === 'SUPERADMIN') ? '/admin-dashboard' : '/hr-dashboard'
                 
    return <Navigate to={path} replace />
  }

  return <>{children}</>
}
