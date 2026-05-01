import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Clock, 
  UserCheck, 
  UserMinus, 
  MoreHorizontal, 
  ChevronRight,
  Search,
  Filter,
  FileText,
  ShieldCheck,
  TrendingUp,
  Mail
} from 'lucide-react'
import { useState } from 'react'

export function HumanResourcesPage() {
  const [view, setView] = useState<'attendance' | 'leave'>('attendance')

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-xl bg-luxury-blue/10 flex items-center justify-center text-luxury-blue">
                 <ShieldCheck size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Departmental Intelligence</p>
           </div>
           <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">Human <span className="text-luxury-blue">Capital.</span></h1>
        </div>

        <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-1.5 rounded-[24px]">
           <button 
             onClick={() => setView('attendance')}
             className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
               view === 'attendance' ? 'bg-white dark:bg-luxury-blue text-luxury-blue dark:text-white shadow-xl' : 'text-slate-500'
             }`}
           >
             Attendance Sync
           </button>
           <button 
             onClick={() => setView('leave')}
             className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
               view === 'leave' ? 'bg-white dark:bg-luxury-blue text-luxury-blue dark:text-white shadow-xl' : 'text-slate-500'
             }`}
           >
             Leave Control
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Main Content Area */}
         <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-[48px] border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                    {view === 'attendance' ? 'Real-time Presence' : 'Leave Requests Queue'}
                  </h3>
                  <div className="flex items-center gap-3">
                     <button className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-luxury-blue transition-colors">
                        <Search size={18} />
                     </button>
                     <button className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-luxury-blue transition-colors">
                        <Filter size={18} />
                     </button>
                  </div>
               </div>

               <div className="space-y-4">
                  {view === 'attendance' ? (
                    [
                      { name: 'Alexander Wright', role: 'Sr. Engineer', status: 'Active', time: '09:02 AM', location: 'Office' },
                      { name: 'Sarah Jenkins', role: 'UI Designer', status: 'Remote', time: '08:45 AM', location: 'London' },
                      { name: 'Marcus Chen', role: 'Project Lead', status: 'Active', time: '09:15 AM', location: 'Office' },
                      { name: 'Elena Rodriguez', role: 'DevOps', status: 'Offline', time: '-', location: '-' },
                    ].map((emp, i) => (
                      <motion.div 
                        key={emp.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-5 bg-white dark:bg-luxury-black/40 rounded-[32px] border border-slate-100 dark:border-white/5 hover:border-luxury-blue/30 transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-slate-400 group-hover:text-luxury-blue transition-colors">
                               {emp.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">{emp.name}</p>
                               <p className="text-[10px] font-bold text-slate-500">{emp.role}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-12">
                            <div className="hidden sm:block text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                               <div className="flex items-center gap-2 justify-end">
                                  <div className={`h-1.5 w-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : emp.status === 'Remote' ? 'bg-luxury-blue' : 'bg-slate-400'}`} />
                                  <span className="text-[10px] font-bold text-slate-900 dark:text-white">{emp.status}</span>
                               </div>
                            </div>
                            <div className="hidden sm:block text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Check-in</p>
                               <p className="text-[10px] font-bold text-slate-900 dark:text-white">{emp.time}</p>
                            </div>
                            <button className="h-10 w-10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
                               <MoreHorizontal size={18} />
                            </button>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    [
                      { name: 'James Miller', type: 'Sick Leave', duration: '2 Days', date: 'May 10 - May 12', status: 'Pending' },
                      { name: 'Lisa Thompson', type: 'Vacation', duration: '5 Days', date: 'June 01 - June 06', status: 'Approved' },
                    ].map((req, i) => (
                      <div key={req.name} className="p-6 bg-white dark:bg-luxury-black/40 rounded-[32px] border border-slate-100 dark:border-white/5">
                         <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                               <div className="h-12 w-12 rounded-2xl bg-luxury-blue/10 flex items-center justify-center text-luxury-blue">
                                  <UserMinus size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">{req.name}</p>
                                  <p className="text-[10px] font-bold text-slate-500">{req.type}</p>
                               </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {req.status}
                            </span>
                         </div>
                         <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                            <div className="flex items-center gap-6">
                               <div className="flex items-center gap-2 text-slate-500">
                                  <Calendar size={14} />
                                  <span className="text-[10px] font-bold uppercase">{req.date}</span>
                               </div>
                               <div className="flex items-center gap-2 text-slate-500">
                                  <Clock size={14} />
                                  <span className="text-[10px] font-bold uppercase">{req.duration}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition">Reject</button>
                               <button className="px-6 py-2 bg-luxury-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-luxury-blue/20">Approve</button>
                            </div>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar Stats Area */}
         <div className="space-y-8">
            <div className="glass-panel p-8 rounded-[40px] border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Workforce Analytics</h4>
               <div className="space-y-8">
                  {[
                    { label: 'Attendance Rate', value: '94.2%', trend: '+2.1%', icon: TrendingUp, color: 'text-emerald-500' },
                    { label: 'Active Leave', value: '08 Persons', trend: 'Stable', icon: UserMinus, color: 'text-luxury-blue' },
                    { label: 'Unscheduled Absence', value: '0.5%', trend: '-0.2%', icon: Clock, color: 'text-rose-500' },
                  ].map(stat => (
                    <div key={stat.label}>
                       <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                          <span className={`text-[10px] font-black ${stat.color}`}>{stat.trend}</span>
                       </div>
                       <p className="text-2xl font-black italic text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-panel p-8 rounded-[40px] bg-luxury-blue border-transparent text-white shadow-2xl shadow-luxury-blue/20">
               <Mail className="h-8 w-8 mb-6 opacity-80" />
               <h4 className="text-xl font-black uppercase italic mb-4">Send Broadcast</h4>
               <p className="text-sm font-medium mb-8 text-white/80">Communicate with the entire workforce instantly via secure internal channels.</p>
               <button className="w-full py-4 bg-white text-luxury-blue rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                 Initialize Broadcast
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
