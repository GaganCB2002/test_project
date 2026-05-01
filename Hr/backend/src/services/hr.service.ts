import { db } from './db.service'
import { activityService } from './activity.service'
import type {
  ActivityItem,
  AnalyticsSnapshot,
  CandidateStage,
  DashboardMetric,
  HierarchyNode,
  LeaveRequest,
  Role,
  TrendPoint,
} from '../types'

const toCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

const uniqueDepartments = () => [...new Set(db.get().employees.map((employee) => employee.department))]

const getEmployee = (employeeId: string) => db.get().employees.find((employee) => employee.id === employeeId)

const buildHierarchyNode = (employeeId: string): HierarchyNode | null => {
  const employee = getEmployee(employeeId)
  if (!employee) return null

  const reportCount = db.get().employees.filter((entry) => entry.managerId === employeeId).length

  return {
    id: employee.id,
    name: employee.name,
    title: employee.title,
    department: employee.department,
    level: employee.level,
    reportCount,
    location: employee.location,
  }
}

const activity = (): ActivityItem[] =>
  [...db.get().activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

const totalHeadcount = () => db.get().employees.length
const netPayroll = () => db.get().payroll.reduce((sum, record) => sum + record.breakdown.net, 0)

const accessibleModules = (role: Role) => {
  const all = [
    'dashboard',
    'recruitment',
    'onboarding',
    'employees',
    'attendance',
    'payroll',
    'performance',
    'projects',
    'engagement',
    'compliance',
    'exit',
    'budget',
    'analytics',
    'allocation',
    'chat',
    'mail'
  ]
  
  if (role === 'Employee') return ['dashboard', 'onboarding', 'attendance', 'performance', 'projects', 'chat', 'mail']
  if (role === 'Marketing') return ['dashboard', 'chat', 'mail', 'projects']
  return all
}

export const hrService = {
  getDashboard(role: Role) {
    const d = db.get()
    const analytics = this.getAnalytics()
    return {
      hero: {
        title: 'AuraHR Command Center',
        subtitle: 'Enterprise-grade workforce operations with real-time sync and AI modules.',
        modules: accessibleModules(role),
      },
      metrics: [
        { id: 'headcount', label: 'Total Workforce', value: totalHeadcount().toString(), delta: '+4.2% YoY', tone: 'positive' },
        { id: 'attendance', label: 'Attendance', value: `${d.attendance.attendanceRate}%`, delta: 'Live status', tone: 'neutral' },
        { id: 'payroll', label: 'Monthly Payroll', value: toCurrency(netPayroll()), delta: 'Confirmed', tone: 'neutral' },
        { id: 'utilization', label: 'Avg Productivity', value: '88%', delta: '+2% reach', tone: 'positive' }
      ] as DashboardMetric[],
      aiInsights: analytics.aiInsights,
      activity: activity().slice(0, 8),
      attendanceTrend: d.attendanceTrend,
      productivityTrend: [
        { label: 'Mon', value: 82 },
        { label: 'Tue', value: 85 },
        { label: 'Wed', value: 89 },
        { label: 'Thu', value: 84 },
        { label: 'Fri', value: 80 }
      ],
      budgetUtilization: d.budgets.map(b => ({
        department: b.department,
        utilization: Math.round((b.spent / b.allocated) * 100),
        forecast: b.forecastNextQuarter
      })),
      alerts: [
        'Security Review: Data retention compliance overdue.',
        'Action Required: 2 contractor renewals pending by Friday.'
      ],
      allocations: d.allocations.slice(0, 5)
    }
  },

  getRecruitment() {
    const d = db.get()
    return {
      jobBoardCoverage: ['LinkedIn', 'Naukri', 'Indeed', 'Internal'],
      pipeline: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Offered', 'Background Check'],
      candidates: d.candidates,
      pipelineCounts: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Offered', 'Background Check'].map(stage => ({
        stage,
        count: d.candidates.filter(c => c.stage === stage).length
      }))
    }
  },

  updateCandidateStage(candidateId: string, stage: CandidateStage) {
    let candidate: any = null
    db.update((data) => {
      const found = data.candidates.find(c => c.id === candidateId)
      if (found) {
        found.stage = stage
        candidate = found
        data.activities.unshift({
          id: `act-${Date.now()}`,
          title: 'Candidate Progressed',
          detail: `${found.name} moved to ${stage}`,
          category: 'Recruitment',
          actor: 'System',
          timestamp: new Date().toISOString()
        })
      }
    })
    return candidate
  },

  getEmployees() {
    const d = db.get()
    return {
      employees: d.employees,
      departments: uniqueDepartments().map(dept => ({
        department: dept,
        count: d.employees.filter(e => e.department === dept).length
      }))
    }
  },

  getHierarchyRoot() {
    return buildHierarchyNode('emp-100')
  },

  getHierarchyChildren(employeeId: string) {
    return db.get().employees
      .filter((e) => e.managerId === employeeId)
      .map((e) => buildHierarchyNode(e.id))
      .filter(Boolean) as HierarchyNode[]
  },

  getAttendance() {
    const d = db.get()
    return {
      overview: d.attendance,
      trend: d.attendanceTrend,
      leaveRequests: d.leaveRequests
    }
  },

  createLeaveRequest(input: Omit<LeaveRequest, 'id' | 'status'>) {
    const request: LeaveRequest = {
      id: `leave-${Date.now()}`,
      status: 'Pending',
      ...input
    }
    db.update((data) => {
      data.leaveRequests.unshift(request)
    })
    activityService.log({
      title: 'Leave Requested',
      detail: `${request.employeeName} requested ${request.type}`,
      category: 'Attendance',
      actor: request.employeeName
    })
    return request
  },

  getPayroll() {
    const d = db.get()
    return {
      records: d.payroll,
      summary: {
        totalNet: netPayroll(),
        processed: d.payroll.filter(r => r.bankStatus === 'Processed').length,
        queued: d.payroll.filter(r => r.bankStatus === 'Queued').length
      }
    }
  },

  getProjects() {
    const d = db.get()
    return {
      tasks: d.tasks,
      utilization: d.tasks.map(t => ({
        employeeName: t.employeeName,
        hours: t.loggedHours,
        productivityScore: t.productivityScore
      }))
    }
  },

  getPlatform(role: Role) {
    const d = db.get()
    return {
      dashboard: this.getDashboard(role),
      recruitment: this.getRecruitment(),
      onboarding: { records: d.onboarding || [], progressSummary: { pending: (d.onboarding || []).filter(o => o.status !== 'Completed').length, avgCompletion: 75 } },
      employees: this.getEmployees(),
      attendance: this.getAttendance(),
      payroll: role === 'Employee' ? null : this.getPayroll(),
      performance: { records: d.performance || [], averageReview: 4.4 },
      projects: this.getProjects(),
      engagement: { records: d.engagement || [], avgSentiment: 88 },
      compliance: { items: d.compliance || [], overdue: (d.compliance || []).filter(c => c.status === 'Overdue').length },
      exits: role === 'Employee' ? null : { records: d.exits || [], pendingAssets: (d.exits || []).reduce((sum, e) => sum + (e.assetReturn === 'Pending' ? 1 : 0), 0) },
      budget: (role === 'CEO' || role === 'HR') ? { 
        records: d.budgets, 
        totalAllocated: d.budgets.reduce((sum, b) => sum + b.allocated, 0),
        totalSpent: d.budgets.reduce((sum, b) => sum + b.spent, 0)
      } : null,
      analytics: this.getAnalytics(),
      allocations: d.allocations,
      activity: d.activities
    }
  },

  getAnalytics(): AnalyticsSnapshot {
    const d = db.get()
    return {
      employeeCount: totalHeadcount(),
      attritionRate: 11.2,
      avgEngagement: 86,
      avgPerformance: 4.4,
      attendanceRate: d.attendance.attendanceRate,
      hiringCostPerEmployee: 125000,
      trends: {
        attendance: d.attendanceTrend,
        attrition: [],
        productivity: [],
        salary: []
      },
      aiInsights: {
        attritionHotspots: [],
        recommendations: ['AI Insight: Review resource allocation for Engineering pod with 120% utilization.']
      }
    }
  },

  getActivity() {
    return activity()
  }
}
