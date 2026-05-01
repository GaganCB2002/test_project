import React, { useState, useEffect } from 'react'
import { api } from '../api/client'
import { socket } from '../api/socket'
import { StatusBadge } from '../components/ui/StatusBadge'
import { SectionCard } from '../components/ui/SectionCard'
import { CheckCircle, XCircle, FileText, User, Calendar, ExternalLink } from 'lucide-react'
import type { User as UserType } from '../types'

export default function HRLeavePortal({ token }: { token: string }) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchAllLeaves = async () => {
    try {
      const data = await api.getAllLeaveRequests(token)
      setRequests(data)
    } catch (err) {
      console.error("Failed to fetch all leaves", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllLeaves()
    
    socket.on('leave_update', (data) => {
      setRequests(prev => [data, ...prev])
    })

    return () => { socket.off('leave_update') }
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await api.approveLeave(id, token)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r))
    } catch (err) {
      alert("System Error: Approval sequence failed.")
    }
  }

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectModal) return
    
    try {
      await api.rejectLeave(rejectModal.id, rejectionReason, token)
      setRequests(prev => prev.map(r => r.id === rejectModal.id ? { ...r, status: 'REJECTED', hr_reason: rejectionReason } : r))
      setRejectModal(null)
      setRejectionReason('')
    } catch (err) {
      alert("System Error: Rejection sequence failed.")
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest">Hydrating Global Absence Data...</div>

  return (
    <div className="space-y-6">
      <header className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm">
         <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">HR Leave Command <span className="text-brand">Portal.</span></h1>
         <p className="text-slate-500 font-medium mt-2">Administrative interface for organizational absence oversight and policy enforcement.</p>
      </header>

      <SectionCard title="Global Pending Queue" subtitle={`${requests.filter(r => r.status === 'PENDING').length} requests requiring immediate review.`}>
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['Employee', 'Category', 'Timeline', 'Objective', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500">
                          {req.employee_name?.charAt(0) || 'U'}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">{req.employee_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{req.employee_email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge label={req.leave_type?.toUpperCase()} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
                       <Calendar size={12} className="text-slate-400" />
                       {new Date(req.from_date).toLocaleDateString()} - {new Date(req.to_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-slate-500 max-w-xs truncate group-hover:whitespace-normal transition-all">"{req.reason}"</p>
                    {req.document_url && (
                       <a href={req.document_url} target="_blank" className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-brand hover:underline">
                          <FileText size={12} /> Supporting Evidence <ExternalLink size={10} />
                       </a>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge label={req.status} />
                  </td>
                  <td className="px-6 py-5">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleApprove(req.id)}
                          className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition shadow-sm"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => setRejectModal({ id: req.id })}
                          className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-sm"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                       <p className="text-[10px] font-black uppercase text-slate-300 italic">Actioned</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {rejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setRejectModal(null)} />
           <div className="relative z-[110] w-full max-w-md bg-white p-10 rounded-[48px] shadow-2xl">
              <h3 className="text-2xl font-black text-rose-500 uppercase tracking-tighter italic">Rejection Reason.</h3>
              <p className="text-slate-500 text-sm mt-3">Formal justification is required for the employee record.</p>
              
              <form onSubmit={handleRejectSubmit} className="mt-8 space-y-6">
                 <textarea 
                   required
                   value={rejectionReason}
                   onChange={e => setRejectionReason(e.target.value)}
                   className="w-full p-6 rounded-[32px] bg-slate-50 border border-slate-100 text-sm font-medium min-h-[150px] outline-none focus:ring-2 focus:ring-rose-500"
                   placeholder="Specify administrative reason..."
                 />
                 <div className="flex gap-4">
                    <button type="button" onClick={() => setRejectModal(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20">Finalize Rejection</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}
