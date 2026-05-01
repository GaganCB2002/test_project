export type ThemeMode = 'light' | 'dark'

export type NavSectionId =
  | 'overview'
  | 'workspaces'
  | 'projects'
  | 'employees'
  | 'hr-management'
  | 'task-management'
  | 'attendance'
  | 'payroll'
  | 'revenue-analytics'
  | 'performance-metrics'
  | 'project-insights'
  | 'roi-dashboard'
  | 'messages'
  | 'channels'
  | 'notifications'
  | 'ai-assistant'
  | 'predictions'
  | 'automation-center'
  | 'settings'
  | 'user-roles'
  | 'logs'
  | 'security'

export interface NavigationItem {
  id: NavSectionId
  label: string
  group: string
  description: string
}

export interface WorkspaceOption {
  id: string
  name: string
  owner: string
  region: string
  health: 'Healthy' | 'Attention' | 'Scaling'
}

export interface MetricDetail {
  title: string
  summary: string
  bullets: string[]
}

export interface DashboardMetric {
  id: string
  label: string
  value: string
  delta: string
  comparison: string
  direction: 'up' | 'down'
  accent: string
  detail: MetricDetail
  targetSection: NavSectionId
}

export interface RevenuePoint {
  label: string
  revenue: number
  investment: number
}

export interface StatusBreakdown {
  label: string
  value: number
  color: string
}

export interface RoiProject {
  name: string
  roi: number
  budget: string
  status: 'Scaling' | 'Watch' | 'Strong'
}

export interface ProjectIntelligenceItem {
  name: string
  owner: string
  currentCost: string
  estimatedCost: string
  budgetDelta: string
  completion: number
  risk: 'Low' | 'Moderate' | 'High'
}

export interface AiInsight {
  id: string
  title: string
  detail: string
  severity: 'Info' | 'Warning' | 'Critical'
  actionLabel: string
  targetSection: NavSectionId
}

export interface TimelineEvent {
  id: string
  title: string
  detail: string
  actor: string
  timestamp: string
  type: 'Project' | 'Finance' | 'People' | 'System'
}

export interface WorkspaceCardData {
  name: string
  manager: string
  openProjects: number
  employees: number
  status: 'Live' | 'Pending' | 'Review'
}

export interface ProjectCardData {
  name: string
  client: string
  budget: string
  dueDate: string
  team: number
  progress: number
  risk: 'Low' | 'Moderate' | 'High'
}

export interface EmployeeSnapshot {
  name: string
  role: string
  attendance: number
  performance: number
  workHours: number
  location: string
}

export interface HeatmapCell {
  label: string
  intensity: number
}

export interface CommunicationThread {
  title: string
  excerpt: string
  channel: string
  unread: boolean
}

export interface SystemStatusItem {
  label: string
  description: string
  state: 'Healthy' | 'Degraded' | 'Syncing'
}

export interface SectionCardMetric {
  label: string
  value: string
  helper: string
}

export interface SectionBoardItem {
  title: string
  meta: string
  status: string
}

export interface SectionBlueprint {
  id: NavSectionId
  eyebrow: string
  title: string
  description: string
  metrics: SectionCardMetric[]
  boardTitle: string
  boardDescription: string
  boardItems: SectionBoardItem[]
  sideTitle: string
  sideDescription: string
  sideItems: string[]
}

export interface ServiceConnection {
  name: string
  port: number
  status: 'Connected' | 'Pending'
}

export interface DashboardDataset {
  user: {
    name: string
    role: string
    initials: string
  }
  workspaces: WorkspaceOption[]
  metrics: DashboardMetric[]
  revenueSeries: RevenuePoint[]
  projectStatus: StatusBreakdown[]
  roiProjects: RoiProject[]
  intelligence: ProjectIntelligenceItem[]
  aiInsights: AiInsight[]
  activity: TimelineEvent[]
  workspaceCards: WorkspaceCardData[]
  projectCards: ProjectCardData[]
  employees: EmployeeSnapshot[]
  heatmap: HeatmapCell[]
  communications: CommunicationThread[]
  systemHealth: SystemStatusItem[]
  sections: SectionBlueprint[]
  services: ServiceConnection[]
}
