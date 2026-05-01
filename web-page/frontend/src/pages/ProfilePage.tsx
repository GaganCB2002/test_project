import { useState } from 'react'
import { User as UserIcon, Mail, Shield, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../api/client'
import { SectionCard } from '../components/ui/SectionCard'
import type { User } from '../types'

interface ProfilePageProps {
  user: User
  token: string
  onUpdate: (user: User) => void
}

export function ProfilePage({ user, token, onUpdate }: ProfilePageProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const updatedUser = await api.updateProfile(formData, token)
      onUpdate(updatedUser)
      setStatus({ type: 'success', message: 'Profile updated successfully!' })
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-16 w-16 rounded-3xl bg-brand/10 flex items-center justify-center text-brand">
          <UserIcon size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">User Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your identity and account settings</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Personal Information" subtitle="Update your display name and contact email.">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm font-bold text-slate-900 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm font-bold text-slate-900 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {status && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-sm font-bold text-white shadow-lg shadow-brand/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Account Status" subtitle="System-assigned privileges.">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2 text-brand">
                  <Shield size={18} />
                  <p className="text-xs font-black uppercase tracking-widest">Enterprise Role</p>
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">{user.role}</p>
                <p className="text-xs text-slate-500 mt-1">Contact your IT administrator to request permission changes.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employee ID</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{user.employeeId || 'N/A'}</p>
              </div>
            </div>
          </SectionCard>

          <div className="p-6 rounded-[32px] bg-slate-950 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-20">
                <Shield size={120} />
             </div>
             <div className="relative z-10">
                <h3 className="text-xl font-bold">Security Tip</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  Always use a unique password for your AuraHR account. Your activity is logged for enterprise security auditing.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
