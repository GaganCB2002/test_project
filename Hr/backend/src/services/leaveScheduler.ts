import { db } from './db.service'
import { activityService } from './activity.service'
import type { LeaveRequest } from '../types'

export const leaveScheduler = {
  start() {
    console.log('[SCHEDULER] Auto Uninformed Leave Detection started...')
    
    // Check every minute for simulation (in production this would be once a day)
    setInterval(() => {
      this.detectAbsences()
    }, 60000)
  },

  detectAbsences() {
    const today = new Date().toISOString().split('T')[0]
    const d = db.get()
    
    // Mock logic: If an employee is not 'Present' and has no leave request for today
    d.employees.forEach(employee => {
      const hasLeave = d.leaveRequests.some(r => 
        r.employeeId === employee.id && 
        r.from <= today && 
        r.to >= today
      )

      // Randomly simulate an absence for demonstration if they don't have leave
      // In a real system, this would be tied to biometric/swipe data
      if (!hasLeave && Math.random() < 0.05) { 
        this.createUninformedLeave(employee, today)
      }
    })
  },

  createUninformedLeave(employee: any, date: string) {
    const request: LeaveRequest = {
      id: `leave-uninformed-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      type: 'Uninformed Leave',
      from: date,
      to: date,
      status: 'Pending Documents',
      reason: 'System detected absence without prior leave application.',
      isUninformed: true,
      createdAt: new Date().toISOString(),
    }

    db.update((data) => {
      // Check if already created for today to avoid duplicates
      const exists = data.leaveRequests.some(r => r.employeeId === employee.id && r.from === date && r.isUninformed)
      if (!exists) {
        data.leaveRequests.unshift(request)
        activityService.log({
          title: 'Uninformed Absence Detected',
          detail: `System auto-created leave entry for ${employee.name}. Documents required.`,
          category: 'Attendance',
          actor: 'Aura AI'
        })
      }
    })
  }
}
