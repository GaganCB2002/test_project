import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './db.service'
import type { AppUser, AuthPayload } from '../types'

const JWT_SECRET = process.env.JWT_SECRET ?? 'aurahr-demo-secret'
const TOKEN_TTL = '8h'
const PORTAL_ORIGIN = process.env.PORTAL_URL ?? 'http://127.0.0.1:3005'
const CEO_CONSOLE_ORIGIN = process.env.CEO_DASHBOARD_URL ?? 'http://127.0.0.1:3001'
const EMPLOYEE_APP_ORIGIN = process.env.EMPLOYEE_APP_URL ?? 'http://127.0.0.1:5173'
const TECH_LEAD_APP_ORIGIN = process.env.TECH_LEAD_APP_URL ?? 'http://127.0.0.1:3003'

const sanitizeUser = (user: AppUser) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  employeeId: user.employeeId,
})

const normalizeRole = (role?: string | null) => {
  const value = (role ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_')

  if (value === 'LEAD' || value === 'TECHLEAD' || value === 'TECH_LEAD') return 'TECH_LEAD'
  if (value === 'EMPLOYEE') return 'EMPLOYEE'
  if (value === 'MANAGER') return 'MANAGER'
  if (value === 'HR') return 'HR'
  if (value === 'MARKETING') return 'MARKETING'
  if (value === 'ADMIN') return 'ADMIN'
  if (value === 'CEO') return 'CEO'

  return 'EMPLOYEE'
}

const getRedirectUrl = (role: string) => {
  if (role === 'EMPLOYEE') return `${EMPLOYEE_APP_ORIGIN}/dashboard`
  if (role === 'TECH_LEAD') return `${TECH_LEAD_APP_ORIGIN}/dashboard`
  if (role === 'CEO' || role === 'ADMIN') return CEO_CONSOLE_ORIGIN
  if (role === 'HR') return `${PORTAL_ORIGIN}/hr-dashboard`
  if (role === 'MANAGER') return `${PORTAL_ORIGIN}/manager-dashboard`
  if (role === 'MARKETING') return `${PORTAL_ORIGIN}/marketing-hub`

  return `${PORTAL_ORIGIN}/dashboard`
}

export const authService = {
  async login(email: string, password: string): Promise<any | null> {
    console.log(`[AUTH] Login Attempt: ${email} with password: ${password}`);

    // 0. Master Logic (Instant bypass for demo accounts)
    const isMasterPassword = (password === '123456' || password === 'lead123' || password === 'emp123' || password === 'hr123' || password === 'marketing123' || password === 'Password@123' || password === 'demo1234');
    
    // Explicit list of demo emails that should always work with master passwords
    const demoEmails = [
      'hr@company.com', 
      'hr@aurahr.com', 
      'marketing@aurahr.com',
      'lead@company.com', 
      'techlead@company.com', 
      'emp@company.com',
      'ceo@aurahr.com'
    ];

    if (isMasterPassword && demoEmails.includes(email.toLowerCase())) {
      const fallbackUser = {
        'hr@company.com': { id: 'u-2', name: 'HR Manager', role: 'HR' },
        'hr@aurahr.com': { id: 'u-2', name: 'Nisha Kapoor', role: 'HR' },
        'marketing@aurahr.com': { id: 'u-mkt', name: 'Marketing Lead', role: 'Marketing' },
        'lead@company.com': { id: 'u-lead', name: 'Tech Lead', role: 'Lead' },
        'techlead@company.com': { id: 'u-techlead', name: 'Tech Lead', role: 'Lead' },
        'emp@company.com': { id: 'u-4', name: 'General Employee', role: 'Employee' },
        'ceo@aurahr.com': { id: 'u-1', name: 'Aarav Mehta', role: 'CEO' }
      }[email.toLowerCase()];

      if (fallbackUser) {
        console.log(`[AUTH] Master Bypass hit for ${email}. Assigning role: ${fallbackUser.role}`);
        return this.generateSession({ ...fallbackUser, email, employeeId: fallbackUser.id, passwordHash: '' } as any);
      }
    }

    // 1. Try Employee Server (Django) next
    try {
      const djangoUrl = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000/api'
      const response = await fetch(`${djangoUrl}/accounts/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data: any = await response.json()
        console.log(`Django Login Success for ${email}`);
        const employeeUser: AppUser = {
          id: data.user.id,
          email: data.user.email,
          name: `${data.user.first_name} ${data.user.last_name}`.trim(),
          role: data.user.role || 'Employee',
          employeeId: data.user.id,
          passwordHash: '',
        }
        return this.generateSession(employeeUser, data.tokens.access)
      }
    } catch (err) {
      console.error(`Failed to connect to Employee Server for ${email}:`, err)
    }

    // 2. Local HR database check
    const localUser = db.get().users.find((entry) => entry.email.toLowerCase() === email.toLowerCase())
    if (localUser) {
      console.log(`[AUTH] Local user found for ${email}. Verifying password...`);
      const match = bcrypt.compareSync(password, localUser.passwordHash)
      if (match) {
        console.log(`[AUTH] Local login success for ${email}`);
        return this.generateSession(localUser)
      } else {
        console.warn(`[AUTH] Password mismatch for local user ${email}`);
      }
    }

    console.warn(`[AUTH] Authentication failed for: ${email}`);
    return null
  },

  generateSession(user: AppUser, externalToken?: string) {
    const normalizedRole = normalizeRole(user.role)
    const token = jwt.sign(
      {
        sub: user.id,
        role: normalizedRole,
        email: user.email,
        name: user.name,
        externalToken: externalToken || null
      },
      JWT_SECRET,
      { expiresIn: TOKEN_TTL },
    )

    const role = normalizedRole
    const redirectUrl = getRedirectUrl(role)

    console.log(`[AUTH] Session generated for ${user.email}. Final Role: ${role}`)

    return {
      token,
      user: sanitizeUser(user),
      role,
      redirectUrl,
    }
  },

  verify(token: string) {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  },

  getUser(userId: string | number, payload?: any) {
    const user = db.get().users.find((entry) => String(entry.id) === String(userId))
    if (user) return sanitizeUser(user)

    // If not found in local DB, but we have a payload (from JWT), return a virtual user
    if (payload && payload.email) {
      return {
        id: String(userId),
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        role: payload.role,
        employeeId: String(userId)
      }
    }
    return null
  },

  updateUser(userId: string, data: { name?: string; email?: string }) {
    let result: ReturnType<typeof sanitizeUser> | null = null
    db.update((current) => {
      const user = current.users.find((entry) => entry.id === userId)
      if (user) {
        if (data.name) {
          user.name = data.name
          if (user.employeeId) {
            const employee = current.employees.find((e) => e.id === user.employeeId)
            if (employee) employee.name = data.name
          }
        }
        if (data.email) {
          user.email = data.email
          if (user.employeeId) {
            const employee = current.employees.find((e) => e.id === user.employeeId)
            if (employee) employee.email = data.email
          }
        }
        result = sanitizeUser(user)
      }
    })
    return result
  },
}
