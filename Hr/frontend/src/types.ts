export type Role = 'CEO' | 'HR' | 'Manager' | 'Lead' | 'Employee' | 'TECH_LEAD' | 'Marketing' | 'ADMIN'
export type CandidateStage = 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  employeeId?: string
  department?: string
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  category: string
  actor: string
  timestamp: string
}

export interface DashboardMetric {
  id: string
  label: string
  value: string
  delta: string
  tone: 'positive' | 'neutral' | 'warning'
}

export interface TrendPoint {
  label: string
  value: number
  secondaryValue?: number
}

export interface HierarchyNode {
  id: string
  name: string
  title: string
  department: string
  level: Role
  reportCount: number
  location: string
}

export interface Candidate {
  id: string
  name: string
  appliedFor: string
  department: string
  source: string
  stage: string
  aiMatch: number
  experience: number
  skills: string[]
  interviewDate: string
  recruiter: string
  location: string
  compensationExpectation: number
  backgroundCheck: {
    status: string
    vendor: string
  }
}

export interface OnboardingRecord {
  id: string
  employeeId: string
  buddy: string
  completion: number
  status: string
  documents: string[]
  eSignatureComplete: boolean
  assets: string[]
  accessProvisioned: string[]
  tasks: Array<{
    id: string
    label: string
    owner: string
    completed: boolean
  }>
}

export interface Employee {
  id: string
  name: string
  email: string
  title: string
  department: string
  level: Role
  location: string
  joinDate: string
  compensation: number
  engagementScore: number
  performanceRating: number
  attritionRisk: number
  status: string
  documents: string[]
  skills: string[]
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: string
  from: string
  to: string
  status: string
  reason: string
}

export interface PayrollRecord {
  employeeId: string
  employeeName: string
  month: string
  department: string
  bankStatus: string
  breakdown: {
    basic: number
    hra: number
    specialAllowance: number
    bonus: number
    pf: number
    esi: number
    tds: number
    reimbursements: number
    net: number
  }
}

export interface PerformanceRecord {
  employeeId: string
  employeeName: string
  goalCompletion: number
  kpiScore: number
  reviewScore: number
  feedback360: number
  promotionReadiness: string
  strengths: string[]
  coachNotes: string
}

export interface ProjectTask {
  id: string
  employeeId: string
  employeeName: string
  project: string
  title: string
  manager: string
  status: string
  dueDate: string
  loggedHours: number
  productivityScore: number
}

export interface EngagementRecord {
  id: string
  type: string
  title: string
  owner: string
  participation: number
  sentimentScore: number
  publishedAt: string
}

export interface ComplianceItem {
  id: string
  policy: string
  owner: string
  status: string
  dueDate: string
  risk: string
}

export interface ExitRecord {
  id: string
  employeeId: string
  employeeName: string
  stage: string
  lastWorkingDay: string
  settlementStatus: string
  assetReturn: string
  exitInterview: boolean
}

export interface BudgetRecord {
  department: string
  allocated: number
  spent: number
  hiringCost: number
  trainingCost: number
  benefitsCost: number
  forecastNextQuarter: number
  roi: number
}

export interface SalaryBand {
  department: string
  avgSalary: number
  bonusPool: number
}

export interface InternalEmail {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  subject: string
  body: string
  timestamp: string
  read: boolean
  folder: 'inbox' | 'sent' | 'favorites' | 'trash'
}

export interface DashboardData {
  hero: {
    title: string
    subtitle: string
    modules: string[]
  }
  metrics: DashboardMetric[]
  aiInsights: {
    attritionHotspots: Array<{ name: string; department: string; risk: number }>
    recommendations: string[]
  }
  activity: ActivityItem[]
  attendanceTrend: TrendPoint[]
  productivityTrend: TrendPoint[]
  budgetUtilization: Array<{
    department: string
    utilization: number
    forecast: number
  }>
  alerts: string[]
}

export interface PlatformData {
  dashboard: DashboardData
  recruitment: {
    jobBoardCoverage: string[]
    pipeline: string[]
    candidates: Candidate[]
    pipelineCounts: Array<{ stage: string; count: number }>
  }
  onboarding: {
    records: OnboardingRecord[]
    progressSummary: {
      pending: number
      avgCompletion: number
    }
  }
  employees: {
    employees: Employee[]
    departments: Array<{ department: string; count: number }>
  }
  attendance: {
    overview: {
      attendanceRate: number
      presentToday: number
      remoteToday: number
      lateMarkings: number
      overtimeHours: number
      leaveBalanceUtilization: number
    }
    trend: TrendPoint[]
    leaveRequests: LeaveRequest[]
  }
  payroll: null | {
    records: PayrollRecord[]
    summary: {
      totalNet: number
      processed: number
      queued: number
    }
  }
  performance: {
    records: PerformanceRecord[]
    averageReview: number
  }
  projects: {
    tasks: ProjectTask[]
    utilization: Array<{ employeeName: string; hours: number; productivityScore: number }>
  }
  engagement: {
    records: EngagementRecord[]
    avgSentiment: number
  }
  compliance: {
    items: ComplianceItem[]
    overdue: number
  }
  exits: null | {
    records: ExitRecord[]
    pendingAssets: number
  }
  budget: null | {
    records: BudgetRecord[]
    totalAllocated: number
    totalSpent: number
  }
  analytics: {
    employeeCount: number
    attritionRate: number
    avgEngagement: number
    avgPerformance: number
    attendanceRate: number
    hiringCostPerEmployee: number
    trends: {
      attendance: TrendPoint[]
      attrition: TrendPoint[]
      productivity: TrendPoint[]
      salary: SalaryBand[]
    }
    aiInsights: {
      attritionHotspots: Array<{ name: string; department: string; risk: number }>
      recommendations: string[]
    }
  }
  activity: ActivityItem[]
}
