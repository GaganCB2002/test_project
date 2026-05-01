import { Router } from 'express'
import { z } from 'zod'
import { authenticate, authorize } from '../middleware/auth'
import { authService } from '../services/auth.service'
import { hrService } from '../services/hr.service'
import { allocationService } from '../services/allocation.service'
import { chatService } from '../services/chat.service'
import { payrollService } from '../services/payroll.service'
import { aiService } from '../services/ai.service'
import { mailService } from '../services/mail.service'
import { db } from '../services/db.service'
import type { CandidateStage } from '../types'

const router = Router()

router.get('/events', (req, res) => {
  const token = typeof req.query.token === 'string' ? req.query.token : null

  if (!token) {
    res.status(401).json({ message: 'Authentication required.' })
    return
  }

  try {
    authService.verify(token)
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' })
    return
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  const emit = () => {
    const list = hrService.getActivity()
    const item = list[Math.floor(Math.random() * list.length)]
    res.write(`data: ${JSON.stringify(item)}\n\n`)
  }

  emit()
  const interval = setInterval(emit, 12000)

  req.on('close', () => {
    clearInterval(interval)
    res.end()
  })
})

// Health & Public Stats
router.get('/stats', (req, res) => {
  const store = db.get()
  res.json({
    totalEmployees: store.employees.length,
    activeRecruitments: store.candidates.filter(c => c.stage !== 'Selected' && c.stage !== 'Rejected').length,
    onboardingCount: store.onboarding.filter(o => o.status !== 'Completed').length
  })
})

router.use(authenticate)

// Platform & Dashboard
router.get('/platform', (req, res) => res.json(hrService.getPlatform(req.auth!.role)))
router.get('/dashboard', (req, res) => res.json(hrService.getDashboard(req.auth!.role)))
router.get('/activity', (req, res) => res.json(hrService.getActivity()))

router.patch('/me', (req, res) => {
  const parsed = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  }).safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ message: 'Invalid profile data' }); return }
  const result = authService.updateUser(req.auth!.sub, parsed.data)
  result ? res.json(result) : res.status(404).json({ message: 'User not found' })
})

// Recruitment
router.get('/recruitment', authorize('CEO', 'HR', 'Manager', 'Lead'), (req, res) => res.json(hrService.getRecruitment()))
router.patch('/recruitment/candidates/:candidateId', authorize('CEO', 'HR', 'Manager'), (req, res) => {
  const parsed = z.object({ stage: z.string() }).safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ message: 'Invalid stage.' }); return }
  const result = hrService.updateCandidateStage(String(req.params.candidateId), parsed.data.stage as CandidateStage)
  result ? res.json(result) : res.status(404).json({ message: 'Not found' })
})

// People & Hierarchy
router.get('/employees', authorize('CEO', 'HR', 'Manager', 'Lead'), (req, res) => res.json(hrService.getEmployees()))
router.get('/hierarchy/root', (req, res) => res.json(hrService.getHierarchyRoot()))
router.get('/hierarchy/:employeeId/children', (req, res) => res.json(hrService.getHierarchyChildren(req.params.employeeId)))

// Attendance & Leaves
router.get('/attendance', authorize('CEO', 'HR', 'Manager', 'Lead'), (req, res) => res.json(hrService.getAttendance()))
router.post('/attendance/leave-requests', (req, res) => {
  const parsed = z.object({
    employeeId: z.string(),
    employeeName: z.string(),
    type: z.enum(['Annual Leave', 'Sick Leave', 'WFH', 'Comp Off']),
    from: z.string(),
    to: z.string(),
    reason: z.string().min(3)
  }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload' })
  res.status(201).json(hrService.createLeaveRequest(parsed.data))
})
router.get('/ai/leave-suggestion', (req, res) => {
  const { employeeId, from, to } = req.query as any
  res.json({ suggestion: aiService.suggestLeaveApproval({ employeeId, from, to } as any) })
})

// Resource Allocation
router.get('/allocation', authorize('CEO', 'HR', 'Manager', 'Lead'), (req, res) => res.json(allocationService.getAll()))
router.post('/allocation', authorize('CEO', 'HR', 'Manager'), (req, res) => {
  const parsed = z.object({
    employeeId: z.string(),
    employeeName: z.string(),
    projectId: z.string(),
    projectName: z.string(),
    hoursPerWeek: z.number(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string()
  }).safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ message: 'Invalid allocation data' }); return }
  res.status(201).json(allocationService.create(parsed.data))
})

// Asset Management
router.get('/assets', authorize('CEO', 'HR', 'Manager', 'Lead'), (req, res) => res.json(allocationService.getAssets()))
router.get('/assets/allocations', authorize('CEO', 'HR', 'Manager', 'Lead'), (req, res) => res.json(allocationService.getAssetAllocations()))
router.post('/assets', authorize('CEO', 'HR'), (req, res) => {
  const parsed = z.object({
    name: z.string(),
    type: z.enum(['Hardware', 'Identification', 'Peripheral', 'Other']),
    status: z.enum(['Available', 'Allocated', 'Maintenance']),
    condition: z.enum(['New', 'Good', 'Fair', 'Poor'])
  }).safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ message: 'Invalid asset data' }); return }
  res.status(201).json(allocationService.addAsset(parsed.data))
})
router.post('/assets/allocate', authorize('CEO', 'HR'), (req, res) => {
  const parsed = z.object({
    assetId: z.string(),
    assetName: z.string(),
    employeeId: z.string(),
    employeeName: z.string(),
    expectedDuration: z.string().optional()
  }).safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ message: 'Invalid allocation payload' }); return }
  res.status(201).json(allocationService.allocateAsset(parsed.data))
})
router.post('/assets/revoke/:id', authorize('CEO', 'HR'), (req, res) => {
  allocationService.revokeAsset(String(req.params.id))
  res.status(204).end()
})

// Chat
router.get('/chat/messages', (req, res) => {
  const { otherId, groupId } = req.query as any
  res.json(chatService.getMessages(req.auth!.sub, otherId, groupId))
})
router.post('/chat/messages', (req, res) => {
  const parsed = z.object({
    receiverId: z.string().optional(),
    groupId: z.string().optional(),
    content: z.string(),
    type: z.enum(['text', 'image', 'file']),
    fileUrl: z.string().optional()
  }).safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ message: 'Invalid message' }); return }
  res.status(201).json(chatService.sendMessage({ ...parsed.data, senderId: req.auth!.sub, senderName: req.auth!.email }))
})

// Email
router.get('/mail/inbox', (req, res) => res.json(mailService.getInbox(req.auth!.sub)))
router.post('/mail/send', (req, res) => {
  const parsed = z.object({
    receiverId: z.string(),
    subject: z.string(),
    body: z.string()
  }).safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ message: 'Invalid email payload' }); return }
  res.status(201).json(mailService.sendMail({
    ...parsed.data,
    senderId: req.auth!.sub,
    senderName: req.auth!.email
  }))
})

// Payroll
router.get('/payroll', authorize('CEO', 'HR', 'Manager'), (_req, res) => res.json(hrService.getPayroll()))
router.patch('/payroll/:employeeId', authorize('CEO', 'HR'), (req, res) => {
  const result = payrollService.updateSalary(String(req.params.employeeId), req.body)
  result ? res.json(result) : res.status(404).json({ message: 'Not found' })
})
router.post('/payroll/process', authorize('CEO', 'HR'), (req, res) => {
  payrollService.processBatch(req.body.month)
  res.status(204).end()
})

// Generic Modules
router.get('/performance', authorize('CEO', 'HR', 'Manager', 'Lead'), (_req, res) => res.json(db.get().performance))
router.get('/projects', authorize('CEO', 'HR', 'Manager', 'Lead'), (_req, res) => res.json(hrService.getProjects()))
router.get('/engagement', authorize('CEO', 'HR', 'Manager', 'Lead'), (_req, res) => res.json(db.get().engagement))
router.get('/compliance', authorize('CEO', 'HR', 'Manager', 'Lead'), (_req, res) => res.json(db.get().compliance))
router.get('/budget', authorize('CEO', 'HR'), (_req, res) => res.json(db.get().budgets))
router.get('/analytics', authorize('CEO', 'HR', 'Manager', 'Lead'), (_req, res) => res.json(hrService.getAnalytics()))

export default router
