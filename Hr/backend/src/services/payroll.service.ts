import { db } from './db.service'
import { activityService } from './activity.service'
import { io } from '../server'
import type { PayrollRecord, PayrollBreakdown } from '../types'

export const payrollService = {
  calculateNet(breakdown: Omit<PayrollBreakdown, 'net' | 'pf' | 'esi' | 'tds'>): PayrollBreakdown {
    const gross = breakdown.basic + breakdown.hra + breakdown.specialAllowance + breakdown.bonus
    
    // Standard Indian Payroll rules (simplified)
    const pf = Math.min(breakdown.basic * 0.12, 1800)
    const esi = gross < 21000 ? gross * 0.0075 : 0
    
    // Simple Tax Slab (simplified)
    const annualGross = gross * 12
    let annualTax = 0
    if (annualGross > 1500000) annualTax = (annualGross - 1500000) * 0.3 + 187500
    else if (annualGross > 1200000) annualTax = (annualGross - 1200000) * 0.2 + 127500
    else if (annualGross > 900000) annualTax = (annualGross - 900000) * 0.15 + 82500
    else if (annualGross > 600000) annualTax = (annualGross - 600000) * 0.1 + 52500
    
    const tds = Math.round(annualTax / 12)
    const net = gross - pf - esi - tds + (breakdown.reimbursements || 0)

    return {
      ...breakdown,
      pf,
      esi,
      tds,
      net
    }
  },

  updateSalary(employeeId: string, updates: Partial<PayrollBreakdown>) {
    let updated: PayrollRecord | null = null
    
    db.update((data) => {
      const record = data.payroll.find(r => r.employeeId === employeeId)
      if (record) {
        const newBreakdown = this.calculateNet({
          ...record.breakdown,
          ...updates
        })
        record.breakdown = newBreakdown
        updated = { ...record }
      }
    })

    if (updated) {
      const u = updated as PayrollRecord
      activityService.log({
        title: 'Payroll Updated',
        detail: `Salary structure updated for ${u.employeeName}`,
        category: 'Payroll',
        actor: 'HR Admin'
      })
      io.emit('payroll_updated', u)
    }
    
    return updated
  },

  processBatch(month: string) {
    db.update((data) => {
      data.payroll.forEach(record => {
        if (record.month === month) {
          record.bankStatus = 'Processed'
        }
      })
    })
    
    activityService.log({
      title: 'Payroll Processed',
      detail: `Monthly payroll batch for ${month} has been synced with the bank.`,
      category: 'Payroll',
      actor: 'System'
    })
    
    io.emit('payroll_batch_processed', month)
  }
}
