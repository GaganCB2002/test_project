import { motion } from 'framer-motion'
import { useState } from 'react'
import { Zap, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export function LoginPage({ 
  onLogin, 
  error: serverError 
}: { 
  onLogin: (email: string, password: string, role: string) => Promise<void>,
  error?: string | null 
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('Employee')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const roles = ['Employee', 'HR', 'Manager', 'Lead', 'Marketing', 'CEO']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLocalError(null)
    
    try {
      await onLogin(email, password, selectedRole)
    } catch (err: any) {
      setLocalError(err.message || 'Invalid credentials. Please verify your identity.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center p-6 selection:bg-luxury-blue/30 overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-luxury-blue/5 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] animate-pulse delay-1000" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="h-16 w-16 bg-luxury-blue rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-luxury-blue/20"
          >
            <Zap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic text-white mb-2">System <span className="text-luxury-blue">Auth.</span></h1>
          <p className="text-slate-500 font-medium tracking-wide">Enter the AuraHR Secure Perimeter</p>
        </div>

        <div className="glass-panel p-10 rounded-[48px] border-white/5 bg-white/5 shadow-premium">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Infrastructure Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-luxury-blue transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="name@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all focus:border-luxury-blue/50 focus:bg-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Access Protocol</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-luxury-blue transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all focus:border-luxury-blue/50 focus:bg-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Security Perimeter Role</label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  const role = e.target.value
                  setSelectedRole(role)
                  if (role === 'CEO') {
                    setEmail('ceo@company.com')
                    setPassword('123456')
                  }
                }}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none transition-all focus:border-luxury-blue/50 focus:bg-white/10 appearance-none cursor-pointer"
              >
                {roles.map(r => <option key={r} value={r} className="bg-luxury-black">{r}</option>)}
              </select>
            </div>

            {(localError || serverError) && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold"
              >
                {localError || serverError}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-luxury-black rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-white/5 hover:bg-luxury-blue hover:text-white transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  Establish Connection
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 text-center">Protocol Shortcuts</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'CEO Admin', email: 'ceo@aurahr.com', role: 'CEO' },
                  { label: 'HR Operations', email: 'hr@aurahr.com', role: 'HR' },
                  { label: 'Platform Lead', email: 'manager@aurahr.com', role: 'Manager' },
                  { label: 'Marketing', email: 'marketing@aurahr.com', role: 'Marketing' },
                  { label: 'Tech Lead', email: 'lead@aurahr.com', role: 'Lead' },
                  { label: 'Employee Hub', email: 'employee@aurahr.com', role: 'Employee' },
                ].map(p => (
                  <button 
                    key={p.label}
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true)
                      setLocalError(null)
                      setEmail(p.email)
                      setPassword('Password@123')
                      setSelectedRole(p.role)
                      try {
                        await onLogin(p.email, 'Password@123', p.role)
                      } catch (err: any) {
                        setLocalError(err.message || 'Identity verification failed.')
                      } finally {
                        setLoading(false)
                      }
                    }}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-luxury-blue/30 transition-all text-left disabled:opacity-50"
                  >
                    <div className="text-white mb-0.5">{p.label}</div>
                    <div className="opacity-40">{p.email}</div>
                  </button>
                ))}
             </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
          Encrypted Connection • Secure Perimeter Active
        </p>
      </motion.div>
    </div>
  )
}
