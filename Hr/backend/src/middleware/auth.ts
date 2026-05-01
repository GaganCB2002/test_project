import type { NextFunction, Request, Response } from 'express'
import { authService } from '../services/auth.service'
import type { Role } from '../types'

const normalizeRole = (role?: string | null) => {
  const value = (role ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_')
  if (value === 'LEAD' || value === 'TECHLEAD' || value === 'TECH_LEAD') return 'TECH_LEAD'
  if (value === 'MANAGER') return 'MANAGER'
  if (value === 'EMPLOYEE') return 'EMPLOYEE'
  if (value === 'MARKETING') return 'MARKETING'
  if (value === 'HR') return 'HR'
  if (value === 'CEO') return 'CEO'
  if (value === 'ADMIN') return 'ADMIN'
  return value
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required.' })
    return
  }

  try {
    const token = header.replace('Bearer ', '')
    req.auth = authService.verify(token)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const allowedRoles = roles.map((role) => normalizeRole(role))
    const activeRole = normalizeRole(req.auth?.role)

    if (!req.auth || !allowedRoles.includes(activeRole)) {
      res.status(403).json({ message: 'You do not have permission to access this resource.' })
      return
    }

    next()
  }
}
