import type { NextFunction, Request, Response } from 'express'
import { authService } from '../services/auth.service'
import type { Role } from '../data/types'

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
    const userRole = req.auth?.role?.toLowerCase()
    const isAllowed = roles.some(r => r.toLowerCase() === userRole)

    if (!req.auth || !isAllowed) {
      res.status(403).json({ message: 'You do not have permission to access this resource.' })
      return
    }

    next()
  }
}
