import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { SectionCard } from '../components/ui/SectionCard'
import { Calendar, FileText, Send, AlertCircle } from 'lucide-react'
import type { User } from '../types'

export default function ApplyLeave({ user, token }: { user: User, token: string }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'Casual',
    from: '',
    to: '',
    reason: '',
    documentUrl: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.type === 'Sick' && !formData.reason) {
       alert("Medical reason is mandatory for Sick Leave.")
       return
    }

    setLoading(true)
    try {
      await api.applyLeave({
        ...formData,
        employeeId: user.id
      }, token)
      
      alert("Application successfully transmitted to HR.")
      navigate('/leave')
    } catch (err) {
      console.error("Submission failed", err)
      alert("System Failure: Unable to process leave request.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionCard title="Submit Leave Application" subtitle="Initialize a formal absence request for administrative review.">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Leave Classification</label>
              <select 
                required
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-white font-bold outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Emergency">Emergency Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Documentation Link (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.documentUrl}
                  onChange={e => setFormData({...formData, documentUrl: e.target.value})}
                  placeholder="https://proof-of-absence.com/doc.pdf"
                  className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="date" 
                  required
                  value={formData.from}
                  onChange={e => setFormData({...formData, from: e.target.value})}
                  className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-white text-sm font-bold outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="date" 
                  required
                  value={formData.to}
                  onChange={e => setFormData({...formData, to: e.target.value})}
                  className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-white text-sm font-bold outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Reason for Absence</label>
            <textarea 
              required
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
              placeholder="Provide context for the administrative record..."
              className="w-full p-6 rounded-[32px] bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-white text-sm min-h-[150px] outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
             <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
             <p className="text-xs text-amber-800 font-medium leading-relaxed">
               By submitting this request, you confirm that the provided information is accurate. False claims may trigger organizational policy reviews.
             </p>
          </div>

          <div className="flex gap-4">
             <button 
               type="button" 
               onClick={() => navigate('/leave')}
               className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition"
             >
               Abort Mission
             </button>
             <button 
               type="submit" 
               disabled={loading}
               className="flex-1 py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               <Send size={14} /> {loading ? 'Transmitting...' : 'Send Leave Request'}
             </button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
