import React, { useState, useEffect } from 'react'
import { api } from '../api/client'
import { socket } from '../api/socket'
import { StatusBadge } from '../components/ui/StatusBadge'
import { SectionCard } from '../components/ui/SectionCard'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import type { User } from '../types'

export default function LeaveDashboard({ user, token }: { user: User, token: string }) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMyLeaves = async () => {
    try {
      const data = await api.getMyLeaveRequests(user.id, token)
      setRequests(data)
    } catch (err) {
      console.error("Failed to fetch leaves", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyLeaves()

    // Real-time status updates
    socket.on('leave_status_update', (update) => {
      setRequests(prev => prev.map(r => 
        r.id === update.id ? { ...r, status: update.status, hr_reason: update.hrReason } : r
      ))
    })

    return () => { socket.off('leave_status_update') }
  }, [])

  if (loading) return <div className="p-12 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest">Scanning Absence Records...</div>

  return (
    <div className="space-y-6">
      <SectionCard title="My Leave Dashboard" subtitle="Track the lifecycle of your time-off applications.">
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['Type', 'Dates', 'Reason', 'Status', 'HR Intelligence'].map((h) => (
                  <th key={h} className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900 uppercase tracking-tight">{req.leave_type}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock size={12} />
                      {new Date(req.from_date).toLocaleDateString()} - {new Date(req.to_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-xs truncate text-slate-600 italic">
                    "{req.reason}"
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge label={req.status} />
                  </td>
                  <td className="px-6 py-5">
                    {req.status === 'REJECTED' ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black text-rose-500 uppercase">Rejection Reason</p>
                        <p className="text-xs font-bold text-slate-700 bg-rose-50 p-2 rounded-xl border border-rose-100">{req.hr_reason || 'Insufficient details provided.'}</p>
                      </div>
                    ) : req.status === 'APPROVED' ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px]">
                        <CheckCircle size={14} /> Mission Authorized
                      </div>
                    ) : (
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Waiting for HR Decision</div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No leave applications found in your history.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
