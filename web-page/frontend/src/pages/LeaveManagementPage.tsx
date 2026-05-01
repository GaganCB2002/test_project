import { useState } from 'react'
import { CheckCircle, XCircle, Upload, AlertTriangle, FileText } from 'lucide-react'
import { SectionCard } from '../components/ui/SectionCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { dateLabel } from '../lib/format'
import type { PlatformData, User } from '../types'

export function LeaveManagementPage({ platform, user }: { platform: PlatformData, user: User }) {
  // We mock the extended state for the demo
  const [requests, setRequests] = useState(() => 
    platform.attendance.leaveRequests.map(r => ({
      ...r,
      hrReason: '',
      clarificationDoc: '',
    }))
  )
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedReq, setSelectedReq] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [docName, setDocName] = useState('')

  // Travel Management State
  const [travelRequests, setTravelRequests] = useState<any[]>([])

  const isHR = user.role === 'HR' || user.role === 'CEO' || user.role === 'Manager'

  // Filter requests if not HR (employee sees only theirs)
  const displayRequests = isHR ? requests : requests.filter(r => r.employeeName === user.name)

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r))
  }

  const handleRejectClick = (id: string) => {
    setSelectedReq(id)
    setRejectReason('')
    setRejectModalOpen(true)
  }

  const submitReject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReq || !rejectReason.trim()) return
    setRequests(prev => prev.map(r => r.id === selectedReq ? { 
      ...r, 
      status: 'Rejected - Clarification Required',
      hrReason: rejectReason 
    } : r))
    setRejectModalOpen(false)
  }

  const handleEscalate = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Escalated' } : r))
  }

  const handleUploadClick = (id: string) => {
    setSelectedReq(id)
    setDocName('')
    setUploadModalOpen(true)
  }

  const submitUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReq || !docName.trim()) return
    setRequests(prev => prev.map(r => r.id === selectedReq ? {
      ...r,
      status: 'Clarification Submitted',
      clarificationDoc: docName
    } : r))
    setUploadModalOpen(false)
  }

  const handleApproveTravel = (id: string) => {
    setTravelRequests(prev => prev.map(t => t.id === id ? { ...t, status: 'Approved' } : t))
  }

  const handleRejectTravel = (id: string) => {
    setTravelRequests(prev => prev.map(t => t.id === id ? { ...t, status: 'Rejected' } : t))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Leave & Clarification Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Review leave requests, request documentation, and handle escalations.</p>
        </div>
      </div>

      <SectionCard title={isHR ? "All Employee Leave Requests" : "My Leave Requests"} subtitle="Track leave approval workflows and clarifications.">
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Details</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Clarification / HR Note</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{req.employeeName}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{req.type}</p>
                    <p className="text-xs text-slate-500">{dateLabel(req.from)} - {dateLabel(req.to)}</p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">"{req.reason}"</p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge label={req.status} />
                  </td>
                  <td className="px-4 py-4 text-xs">
                    {req.hrReason && (
                      <p className="text-rose-600 dark:text-rose-400 font-medium mb-1"><span className="text-slate-500 font-bold">HR:</span> {req.hrReason}</p>
                    )}
                    {req.clarificationDoc && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {req.clarificationDoc}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isHR ? (
                        <>
                          {(req.status.toLowerCase() === 'pending' || req.status === 'Clarification Submitted') && (
                            <>
                              <button onClick={() => handleApprove(req.id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition dark:bg-emerald-900/20 dark:text-emerald-400" title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleRejectClick(req.id)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition dark:bg-rose-900/20 dark:text-rose-400" title="Reject & Ask Clarification">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {req.status === 'Clarification Submitted' && (
                            <button onClick={() => handleEscalate(req.id)} className="px-3 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition flex items-center gap-1 dark:bg-amber-900/20 dark:text-amber-400" title="Escalate Issue">
                              <AlertTriangle className="h-3 w-3" /> Escalate
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {req.status === 'Rejected - Clarification Required' && (
                            <button onClick={() => handleUploadClick(req.id)} className="px-3 py-2 bg-brand/10 text-brand hover:bg-brand/20 rounded-lg text-xs font-bold transition flex items-center gap-1" title="Submit Required Documents">
                              <Upload className="h-3 w-3" /> Submit Document
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {displayRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {isHR && (
        <SectionCard title="Employee Travel Requests" subtitle="Manage business travel approvals and review uploaded tickets.">
          <div className="table-shell overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Destination</th>
                  <th className="px-4 py-3 font-semibold">Dates & Purpose</th>
                  <th className="px-4 py-3 font-semibold">Documents</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {travelRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{req.employeeName || 'John Doe'}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300">{req.destination}</td>
                    <td className="px-4 py-4">
                      <p className="text-xs text-slate-500">{req.dates}</p>
                      <p className="text-[10px] text-slate-400 mt-1 italic">"{req.purpose}"</p>
                    </td>
                    <td className="px-4 py-4">
                      {req.document && req.document !== 'None' ? (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 text-xs">
                          <FileText className="h-3 w-3" /> {req.document}
                        </p>
                      ) : (
                        <p className="text-slate-400 text-xs">No document attached</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge label={req.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status.toLowerCase() === 'pending' && (
                          <>
                            <button onClick={() => handleApproveTravel(req.id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition dark:bg-emerald-900/20 dark:text-emerald-400" title="Approve">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleRejectTravel(req.id)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition dark:bg-rose-900/20 dark:text-rose-400" title="Reject">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {travelRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No travel requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRejectModalOpen(false)} />
          <div className="relative z-50 w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-500" /> Reject & Request Clarification
            </h3>
            <form onSubmit={submitReject} className="mt-4">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Reason for rejection / Required documents</label>
              <textarea 
                required 
                value={rejectReason} 
                onChange={e => setRejectReason(e.target.value)} 
                className="w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-rose-500 min-h-[100px]"
                placeholder="e.g. Please provide a medical certificate for this sick leave."
              />
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setRejectModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/20">Confirm Rejection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Clarification Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setUploadModalOpen(false)} />
          <div className="relative z-50 w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-brand" /> Submit Clarification Document
            </h3>
            <form onSubmit={submitUpload} className="mt-4">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Document Name</label>
              <input 
                type="text"
                required 
                value={docName} 
                onChange={e => setDocName(e.target.value)} 
                className="w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-brand"
                placeholder="e.g. Medical_Certificate.pdf"
              />
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setUploadModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-brand text-white font-bold hover:bg-brand/90 shadow-lg shadow-brand/20">Submit Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
