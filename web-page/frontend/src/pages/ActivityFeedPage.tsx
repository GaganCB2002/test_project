import { motion, AnimatePresence } from 'framer-motion'
import { Activity, User, Briefcase, BadgeIndianRupee, TimerReset, MessageSquare, ShieldAlert } from 'lucide-react'
import type { ActivityItem } from '../types'

interface ActivityFeedPageProps {
  feed: ActivityItem[]
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Login': return <User className="h-4 w-4" />
    case 'Recruitment': return <Briefcase className="h-4 w-4" />
    case 'Payroll': return <BadgeIndianRupee className="h-4 w-4" />
    case 'Attendance': return <TimerReset className="h-4 w-4" />
    case 'Chat': return <MessageSquare className="h-4 w-4" />
    case 'Project': return <Activity className="h-4 w-4" />
    default: return <ShieldAlert className="h-4 w-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Login': return 'bg-blue-500'
    case 'Recruitment': return 'bg-coral'
    case 'Payroll': return 'bg-emerald-500'
    case 'Attendance': return 'bg-amber-500'
    case 'Chat': return 'bg-indigo-500'
    case 'Project': return 'bg-brand'
    default: return 'bg-slate-500'
  }
}

export function ActivityFeedPage({ feed }: ActivityFeedPageProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto overflow-hidden">
      <div className="flex-shrink-0 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Global Activity Stream</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Real-time audit log of system operations and workforce interactions.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 scroll-smooth custom-scrollbar">
        <div className="relative space-y-4 py-4">
          <div className="absolute left-6 top-2 h-[calc(100%-1rem)] w-px bg-slate-200 dark:bg-slate-800/50" />

          <AnimatePresence mode="popLayout" initial={false}>
            {feed.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative flex gap-8 pl-12"
              >
                <div className={`absolute left-0 top-1.5 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white shadow-lg dark:border-slate-900 ${getCategoryColor(item.category)} text-white z-10`}>
                  {getCategoryIcon(item.category)}
                </div>

                <div className="glass-panel flex-1 p-5 hover:border-brand/30 transition-colors dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.category}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.detail}</p>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center gap-2">
                       <div className="h-5 w-5 rounded-full bg-brand/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-brand" />
                       </div>
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.actor}</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {feed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
               <Activity className="h-12 w-12 text-slate-300 mb-4" />
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Awaiting live signals...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
