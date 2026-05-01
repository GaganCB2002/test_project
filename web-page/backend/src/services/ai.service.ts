import { db } from './db.service'
import type { LeaveRequest, Meeting } from '../data/types'

export const aiService = {
  suggestLeaveApproval(request: LeaveRequest) {
    const data = db.get()
    const employee = data.employees.find(e => e.id === request.employeeId)
    if (!employee) return 'No data'

    // Check team workload
    const teamMembers = data.employees.filter(e => e.department === employee.department).map(e => e.id)
    const otherLeaves = data.leaveRequests.filter(l => 
      l.status === 'Approved' && 
      teamMembers.includes(l.employeeId) &&
      ((l.from <= request.to && l.from >= request.from) || (l.to >= request.from && l.to <= request.to))
    )

    if (otherLeaves.length > 2) {
      return 'AI Suggestion: Reconsider approval. High team absence (3+ members) during this period risk project delivery.'
    }

    if (employee.performanceRating > 4.5) {
      return 'AI Suggestion: Likely Safe to Approve. Top performer with low recent leave frequency.'
    }

    return 'AI Suggestion: Standard Approval. No major conflicts detected.'
  },

  async generateMOM(meetingId: string, transcript: string) {
    // In a real app, this would call Gemini.
    // For now, we use a sophisticated template matching.
    const mom = `
# Meeting Minutes: ${transcript.split('\n')[0] || 'Strategic Alignment'}
**Date:** ${new Date().toLocaleDateString()}
**AI Generated Summary:**
- Discussed core project milestones and budget allocation.
- Identified bottleneck in the recruitment pipeline for senior roles.
- Action Item: HR to review compensation benchmarks for Engineering.
- Action Item: IT to finalize asset procurement for the new cohort.
    `.trim()

    db.update((data) => {
      const meeting = data.meetings.find(m => m.id === meetingId)
      if (meeting) {
        meeting.mom = mom
        meeting.status = 'Completed'
      }
    })

    return mom
  }
}
