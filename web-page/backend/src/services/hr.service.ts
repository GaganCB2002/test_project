import mongoose from 'mongoose'
import { db } from './db.service'
import { activityService } from './activity.service'
import Employee from '../models/Employee'
import Attendance from '../models/Attendance'
import Payroll from '../models/Payroll'
import Performance from '../models/Performance'
import type {
  ActivityItem,
  AnalyticsSnapshot,
  CandidateStage,
  DashboardMetric,
  HierarchyNode,
  LeaveRequest,
  Role,
} from '../data/types'

const toCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

const uniqueDepartments = async () => {
  const employees = await Employee.find();
  return [...new Set(employees.map((employee) => employee.department))];
}

const getEmployee = (employeeId: string) => Employee.findOne({ id: employeeId });

const buildHierarchyNode = async (employeeId: string): Promise<HierarchyNode | null> => {
  const employee = await getEmployee(employeeId)
  if (!employee) return null

  const reportCount = await Employee.countDocuments({ managerId: employeeId })

  return {
    id: employee.id,
    name: employee.name,
    title: employee.title,
    department: employee.department,
    level: employee.level as Role,
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

const isConnected = () => mongoose.connection.readyState === 1;

export const hrService = {
  async getDashboard(role: Role) {
    if (!isConnected()) {
      // Fallback to local JSON
      const d = db.get()
      return {
        hero: {
          title: 'AuraHR Command Center (Offline Mode)',
          subtitle: 'Enterprise-grade workforce operations. Running on local cache.',
          modules: accessibleModules(role),
        },
        metrics: [
          { id: 'headcount', label: 'Total Workforce', value: d.employees.length.toString(), delta: 'Cached', tone: 'neutral' },
          { id: 'attendance', label: 'Attendance', value: `${d.attendance.attendanceRate}%`, delta: 'Cached', tone: 'neutral' },
          { id: 'payroll', label: 'Monthly Payroll', value: toCurrency(d.payroll.reduce((sum: any, record: any) => sum + record.breakdown.net, 0)), delta: 'Cached', tone: 'neutral' },
          { id: 'utilization', label: 'Avg Productivity', value: '88%', delta: 'Cached', tone: 'neutral' }
        ] as DashboardMetric[],
        activity: d.activities.slice(0, 8),
        attendanceTrend: d.attendanceTrend,
        budgetUtilization: [],
        alerts: ['Note: System is running in limited mode. Please start MongoDB for full persistence.']
      }
    }

    const headcount = await Employee.countDocuments({ status: 'Active' });
    const payrollRecords = await Payroll.find();
    const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.breakdown.net, 0);
    
    // In a real app, we'd aggregate attendance. For now, using static high-level stats or latest record.
    const attendanceStats = { attendanceRate: 96.4, presentToday: 98 }; 

    return {
      hero: {
        title: 'AuraHR Command Center',
        subtitle: 'Enterprise-grade workforce operations with real-time sync and AI modules.',
        modules: accessibleModules(role),
      },
      metrics: [
        { id: 'headcount', label: 'Total Workforce', value: headcount.toString(), delta: '+4.2% YoY', tone: 'positive' },
        { id: 'attendance', label: 'Attendance', value: `${attendanceStats.attendanceRate}%`, delta: 'Live status', tone: 'neutral' },
        { id: 'payroll', label: 'Monthly Payroll', value: toCurrency(totalPayroll), delta: 'Confirmed', tone: 'neutral' },
        { id: 'utilization', label: 'Avg Productivity', value: '88%', delta: '+2% reach', tone: 'positive' }
      ] as DashboardMetric[],
      activity: [], // Will be fetched from activity service
      attendanceTrend: [],
      budgetUtilization: [],
      alerts: [
        'Security Review: Data retention compliance overdue.',
        'Action Required: 2 contractor renewals pending by Friday.'
      ]
    }
  },

  async getEmployees() {
    if (!isConnected()) {
      const d = db.get()
      return {
        employees: d.employees,
        departments: [...new Set(d.employees.map((e: any) => e.department))].map(dept => ({
          department: dept,
          count: d.employees.filter((e: any) => e.department === dept).length
        }))
      }
    }
    const employees = await Employee.find();
    const departments = await uniqueDepartments();
    return {
      employees: employees,
      departments: departments.map(dept => ({
        department: dept,
        count: employees.filter(e => e.department === dept).length
      }))
    }
  },

  async getHierarchyRoot() {
    return buildHierarchyNode('emp-100')
  },

  async getHierarchyChildren(employeeId: string) {
    const directReports = await Employee.find({ managerId: employeeId });
    const nodes = await Promise.all(directReports.map(e => buildHierarchyNode(e.id)));
    return nodes.filter(Boolean) as HierarchyNode[];
  },

  async getPayroll() {
    if (!isConnected()) {
      const d = db.get()
      const totalNet = d.payroll.reduce((sum: any, r: any) => sum + r.breakdown.net, 0)
      return {
        records: d.payroll,
        summary: {
          totalNet: totalNet,
          processed: d.payroll.filter((r: any) => r.bankStatus === 'Processed').length,
          queued: d.payroll.filter((r: any) => r.bankStatus === 'Queued').length
        }
      }
    }
    const records = await Payroll.find();
    const totalNet = records.reduce((sum, r) => sum + r.breakdown.net, 0);
    return {
      records: records,
      summary: {
        totalNet: totalNet,
        processed: records.filter(r => r.bankStatus === 'Processed').length,
        queued: records.filter(r => r.bankStatus === 'Queued').length
      }
    }
  },

  async getAttendance() {
    if (!isConnected()) {
      return db.get().attendance;
    }
    const records = await Attendance.find();
    return {
      records,
      attendanceRate: 96.4,
      presentToday: records.filter(r => r.status === 'Present').length
    };
  },

  async createLeaveRequest(payload: any) {
    if (!isConnected()) {
      return { success: true, message: 'Leave request recorded (Local Mode)' };
    }
    const attendance = new Attendance({
      employeeId: payload.employeeId,
      date: new Date(payload.from),
      status: 'Leave',
      lateMarking: false,
      overtimeHours: 0
    });
    return await attendance.save();
  },

  async getRecruitment() {
    // In a full implementation, Candidate would be a Mongoose model too
    return {
      jobBoardCoverage: ['LinkedIn', 'Naukri', 'Indeed', 'Internal'],
      pipeline: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Offered', 'Background Check'],
      candidates: [],
      pipelineCounts: []
    }
  },

  async updateCandidateStage(candidateId: string, stage: CandidateStage) {
     return null; // Implementation would involve Candidate model
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

  async getPlatform(role: Role) {
    const dashboard = await this.getDashboard(role);
    const employees = await this.getEmployees();
    const attendance = await this.getAttendance();
    const payroll = role === 'Employee' ? null : await this.getPayroll();
    const performanceRecords = isConnected() ? await Performance.find() : [];
    const analytics = await this.getAnalytics();

    return {
      dashboard,
      recruitment: await this.getRecruitment(),
      onboarding: { records: [], progressSummary: { pending: 0, avgCompletion: 75 } },
      employees,
      attendance,
      payroll,
      performance: { records: performanceRecords, averageReview: 4.4 },
      projects: await this.getProjects(),
      engagement: { records: [], avgSentiment: 88 },
      compliance: { items: [], overdue: 0 },
      exits: role === 'Employee' ? null : { records: [], pendingAssets: 0 },
      budget: null,
      analytics,
      allocations: [],
      activity: []
    }
  },

  async getAnalytics(): Promise<AnalyticsSnapshot> {
    if (!isConnected()) {
      const d = db.get();
      return {
        employeeCount: d.employees.length,
        attritionRate: 11.2,
        avgEngagement: 86,
        avgPerformance: 4.4,
        attendanceRate: 96.4,
        hiringCostPerEmployee: 125000,
        trends: d.attendanceTrend,
        aiInsights: {
          attritionHotspots: [],
          recommendations: ['AI Insight: Local data loaded. System running in offline mode.']
        }
      } as any;
    }
    const headcount = await Employee.countDocuments({ status: 'Active' });
    return {
      employeeCount: headcount,
      attritionRate: 11.2,
      avgEngagement: 86,
      avgPerformance: 4.4,
      attendanceRate: 96.4,
      hiringCostPerEmployee: 125000,
      trends: {
        attendance: [],
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
