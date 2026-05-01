export type Role = 'CEO' | 'HR' | 'Manager' | 'Lead' | 'LEAD' | 'Employee' | 'Marketing' | 'Sales' | 'TECH_LEAD' | 'ADMIN' | 'SUPERADMIN'

export type CandidateStage =
  | 'Applied'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Offered'
  | 'Background Check'

export interface AppUser {
  id: string
  email: string
  name: string
  role: Role
  employeeId?: string
  passwordHash: string
}

export interface Candidate {
  id: string
  name: string
  appliedFor: string
  department: string
  source: string
  stage: CandidateStage
  aiMatch: number
  experience: number
  skills: string[]
  interviewDate: string
  recruiter: string
  location: string
  compensationExpectation: number
  notifications: {
    email: boolean
    sms: boolean
  }
  backgroundCheck: {
    status: 'Pending' | 'In Progress' | 'Completed'
    vendor: string
  }
}

export interface OnboardingTask {
  id: string
  label: string
  owner: string
  completed: boolean
}

export interface OnboardingRecord {
  id: string
  employeeId: string
  buddy: string
  completion: number
  status: 'Pre-boarding' | 'In Progress' | 'Completed'
  documents: string[]
  eSignatureComplete: boolean
  assets: string[]
  accessProvisioned: string[]
  tasks: OnboardingTask[]
}

export interface Employee {
  id: string
  name: string
  email: string
  title: string
  department: string
  level: Role
  location: string
  employmentType: 'Full-time' | 'Contract'
  joinDate: string
  managerId?: string
  compensation: number
  engagementScore: number
  performanceRating: number
  attritionRisk: number
  status: 'Active' | 'Notice Period' | 'Exiting'
  documents: string[]
  skills: string[]
}

export interface AttendanceOverview {
  attendanceRate: number
  presentToday: number
  remoteToday: number
  lateMarkings: number
  overtimeHours: number
  leaveBalanceUtilization: number
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: 'Annual Leave' | 'Sick Leave' | 'WFH' | 'Comp Off'
  from: string
  to: string
  status: 'Pending' | 'Approved' | 'Rejected'
  reason: string
}

export interface PayrollBreakdown {
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

export interface PayrollRecord {
  employeeId: string
  employeeName: string
  month: string
  department: string
  bankStatus: 'Queued' | 'Processed'
  breakdown: PayrollBreakdown
}

export interface PerformanceRecord {
  employeeId: string
  employeeName: string
  goalCompletion: number
  kpiScore: number
  reviewScore: number
  feedback360: number
  promotionReadiness: 'Low' | 'Medium' | 'High'
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
  status: 'Not Started' | 'In Progress' | 'Blocked' | 'Done'
  dueDate: string
  loggedHours: number
  productivityScore: number
}

export interface EngagementRecord {
  id: string
  type: 'Announcement' | 'Survey' | 'Recognition' | 'Chat'
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
  status: 'Compliant' | 'Attention' | 'Overdue'
  dueDate: string
  risk: 'Low' | 'Medium' | 'High'
}

export interface ExitRecord {
  id: string
  employeeId: string
  employeeName: string
  stage: 'Initiated' | 'Knowledge Transfer' | 'Settlement' | 'Completed'
  lastWorkingDay: string
  settlementStatus: 'Pending' | 'In Progress' | 'Completed'
  assetReturn: 'Pending' | 'Completed'
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

export interface TrendPoint {
  label: string
  value: number
  secondaryValue?: number
}

export interface SalaryBand {
  department: string
  avgSalary: number
  bonusPool: number
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  category: 'Login' | 'Recruitment' | 'Payroll' | 'Attendance' | 'Project' | 'Chat' | 'System'
  actor: string
  timestamp: string
}

export interface Asset {
  id: string
  name: string
  type: 'Hardware' | 'Identification' | 'Peripheral' | 'Other'
  status: 'Available' | 'Allocated' | 'Maintenance'
  condition: 'New' | 'Good' | 'Fair' | 'Poor'
}

export interface AssetAllocation {
  id: string
  assetId: string
  assetName: string
  employeeId: string
  employeeName: string
  allocatedAt: string
  returnedAt?: string
  expectedDuration?: string
  status: 'Active' | 'Revoked' | 'Returned'
}

export interface ResourceAllocation {
  id: string
  employeeId: string
  employeeName: string
  projectId: string
  projectName: string
  hoursPerWeek: number
  role: string
  startDate: string
  endDate: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  receiverId?: string
  groupId?: string
  content: string
  type: 'text' | 'image' | 'file'
  fileUrl?: string
  timestamp: string
  read: boolean
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
  folder: 'inbox' | 'sent' | 'draft' | 'trash'
}

export interface Meeting {
  id: string
  title: string
  organizerId: string
  organizerName: string
  attendees: string[]
  startTime: string
  endTime: string
  location: string
  description: string
  mom?: string
  status: 'Scheduled' | 'Completed' | 'Cancelled'
}

export interface AnalysisRecord {
  id: string
  title: string
  developer: string
  status: 'Done' | 'In Progress' | 'Blocked'
  timeSpent: string
  quality: 'High' | 'Medium' | 'Low'
  timestamp: string
}

export interface DashboardMetric {
  id: string
  label: string
  value: string
  delta: string
  tone: 'positive' | 'neutral' | 'warning'
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

export interface AnalyticsSnapshot {
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

export interface SeedData {
  users: (Omit<AppUser, 'passwordHash'> & { passwordSeed: string })[]
  candidates: Candidate[]
  onboarding: OnboardingRecord[]
  employees: Employee[]
  attendance: AttendanceOverview
  attendanceTrend: TrendPoint[]
  leaveRequests: LeaveRequest[]
  payroll: PayrollRecord[]
  performance: PerformanceRecord[]
  tasks: ProjectTask[]
  engagement: EngagementRecord[]
  compliance: ComplianceItem[]
  exits: ExitRecord[]
  budgets: BudgetRecord[]
  activities: ActivityItem[]
  allocations: ResourceAllocation[]
  assets: Asset[]
  assetAllocations: AssetAllocation[]
  messages: ChatMessage[]
  emails: InternalEmail[]
  meetings: Meeting[]
  analysis: AnalysisRecord[]
}

export interface AuthPayload {
  sub: string
  role: Role
  email: string
}
