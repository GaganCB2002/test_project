import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import type { AppUser, AuthPayload } from '../data/types'

const JWT_SECRET = process.env.JWT_SECRET ?? 'aurahr-demo-secret'
const TOKEN_TTL = '24h'

const sanitizeUser = (user: AppUser) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  employeeId: user.employeeId,
})

export const authService = {
  async login(email: string, password: string): Promise<any | null> {
    console.log(`[AUTH] Login Attempt: ${email}`);

    // 0. Production-Grade Demo Bypass (As requested by USER)
    const isMasterPassword = password === '123456';
    
    const demoAccounts: Record<string, any> = {
      'hr@company.com':        { id: 'u-hr',   name: 'HR Director',  role: 'HR',         redirect: '/hr-dashboard' },
      'employee@company.com':  { id: 'u-emp',  name: 'John Doe',     role: 'Employee',   redirect: '/employee-dashboard' },
      'techlead@company.com':  { id: 'u-lead', name: 'Sarah Tech',   role: 'Lead',       redirect: '/teamlead-dashboard' },
      'it@company.com':        { id: 'u-it',   name: 'IT Support',   role: 'IT',         redirect: '/help-desk' },
      'marketing@company.com': { id: 'u-mkt',  name: 'Marketing Pro',role: 'Marketing',  redirect: '/marketing-hub' },
      'manager@company.com':   { id: 'u-mgr',  name: 'Manager Alex', role: 'Manager',    redirect: '/manager-dashboard' },
      'ceo@company.com':       { id: 'u-ceo',  name: 'CEO Visionary',role: 'CEO',        redirect: '/ceo-dashboard' },
      'admin@company.com':     { id: 'u-adm',  name: 'Super Admin',  role: 'ADMIN',      redirect: '/admin-dashboard' },
    };

    const normalizedEmail = email.toLowerCase();
    if (isMasterPassword && demoAccounts[normalizedEmail]) {
      const fallbackUser = demoAccounts[normalizedEmail];
      console.log(`[AUTH] Demo login: ${normalizedEmail} → ${fallbackUser.role}`);
      return this.generateSession({ ...fallbackUser, email: normalizedEmail, employeeId: fallbackUser.id, passwordHash: '' } as any, fallbackUser.redirect);
    }

    // 1. Try Employee Server (Django) for dynamic employee lookups
    try {
      const djangoUrl = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000/api'
      const response = await fetch(`${djangoUrl}/accounts/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data: any = await response.json()
        const employeeUser: AppUser = {
          id: data.user.id,
          email: data.user.email,
          name: `${data.user.first_name} ${data.user.last_name}`.trim(),
          role: 'Employee',
          employeeId: data.user.id,
          passwordHash: '',
        }
        return this.generateSession(employeeUser, 'http://127.0.0.1:5173', data.tokens.access)
      }
    } catch (err) {
      console.error(`[AUTH] Secondary Auth Source (Django) Offline`);
    }

    // 2. Local HR database check (MongoDB)
    try {
      if (mongoose.connection.readyState === 1) {
        const localUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (localUser) {
          const match = bcrypt.compareSync(password, localUser.passwordHash)
          if (match) {
            const roleRedirects: Record<string, string> = {
              'HR': 'http://127.0.0.1:3005/hr-dashboard',
              'ADMIN': 'http://127.0.0.1:3005/hr-dashboard',
              'CEO': 'http://127.0.0.1:3005/hr-dashboard',
              'EMPLOYEE': 'http://127.0.0.1:5173',
              'LEAD': 'http://127.0.0.1:3003',
              'TECH_LEAD': 'http://127.0.0.1:3003',
              'IT': 'http://127.0.0.1:3004',
              'MARKETING': 'http://127.0.0.1:3006'
            };
            const redirectUrl = roleRedirects[localUser.role.toUpperCase()] || 'http://127.0.0.1:3005/dashboard';
            return this.generateSession(localUser as unknown as AppUser, redirectUrl)
          }
        }
      }
    } catch (err) {
      console.warn(`[AUTH] MongoDB Offline - Skipping local database check`);
    }

    return null
  },

  generateSession(user: AppUser, redirectUrl: string, externalToken?: string) {
    const role = (user.role || 'EMPLOYEE').toUpperCase();
    const token = jwt.sign(
      {
        sub: user.id,
        role: role,
        permissions: this.getPermissionsForRole(role),
        email: user.email,
        name: user.name,
        externalToken: externalToken || null
      },
      JWT_SECRET,
      { expiresIn: TOKEN_TTL },
    )

    return {
      token,
      user: sanitizeUser(user),
      role,
      redirectUrl,
    }
  },

  getPermissionsForRole(role: string): string[] {
    const permissions: Record<string, string[]> = {
      'HR': ['all', 'manage_hr', 'view_reports'],
      'ADMIN': ['all'],
      'CEO': ['all'],
      'EMPLOYEE': ['view_self', 'submit_tasks', 'view_payroll'],
      'TECH_LEAD': ['view_team', 'manage_projects', 'code_review'],
      'IT': ['manage_tickets', 'inventory_control'],
      'MARKETING': ['manage_campaigns', 'view_analytics']
    };
    return permissions[role] || ['view_self'];
  },

  verify(token: string) {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  },

  async getUser(userId: string | number, payload?: any) {
    try {
      if (mongoose.connection.readyState === 1) {
        const user = await User.findOne({ id: String(userId) });
        if (user) return sanitizeUser(user as unknown as AppUser)
      }
    } catch (err) {
      console.warn(`[AUTH] MongoDB Offline - Using payload session data`);
    }

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

  async updateUser(userId: string, data: { name?: string; email?: string }) {
    const user = await User.findOne({ id: userId });
    if (!user) return null;

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;

    await user.save();
    return sanitizeUser(user as unknown as AppUser);
  },
}
