import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  Users, 
  MoreVertical,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ChevronRight,
  Target,
  BarChart3,
  Briefcase
} from 'lucide-react'
import { useState } from 'react'

interface Project {
  id: string
  name: string
  status: 'In Progress' | 'Completed' | 'On Hold'
  progress: number
  tasks: number
  completedTasks: number
  team: string[]
  deadline: string
  priority: 'High' | 'Medium' | 'Low'
}

export function ProjectManagementPage() {
  const [activeTab, setActiveTab] = useState<'board' | 'list' | 'timeline'>('board')
  
  const projects: Project[] = [
    { 
      id: '1', 
      name: 'Alpha Deployment', 
      status: 'In Progress', 
      progress: 65, 
      tasks: 24, 
      completedTasks: 16, 
      team: ['JD', 'AS', 'MK'], 
      deadline: '2026-05-15',
      priority: 'High'
    },
    { 
      id: '2', 
      name: 'Security Audit v4', 
      status: 'On Hold', 
      progress: 40, 
      tasks: 12, 
      completedTasks: 5, 
      team: ['RL', 'TH'], 
      deadline: '2026-06-01',
      priority: 'Medium'
    },
    { 
      id: '3', 
      name: 'Client Portal Redesign', 
      status: 'In Progress', 
      progress: 90, 
      tasks: 45, 
      completedTasks: 41, 
      team: ['SM', 'AK', 'PR', 'LV'], 
      deadline: '2026-05-05',
      priority: 'High'
    }
  ]

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-xl bg-luxury-blue/10 flex items-center justify-center text-luxury-blue">
                 <Briefcase size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Global Operations</p>
           </div>
           <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">Project <span className="text-luxury-blue">Command.</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-luxury-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Find project..."
                className="h-12 w-64 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl pl-12 pr-4 text-xs font-bold outline-none focus:border-luxury-blue/50 transition-all"
              />
           </div>
           <button className="h-12 px-6 bg-luxury-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-luxury-blue/20 hover:scale-105 transition-transform flex items-center gap-3">
              <Plus size={16} /> New Project
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Active Projects', value: '12', icon: Target, color: 'text-luxury-blue' },
           { label: 'Total Tasks', value: '148', icon: CheckCircle2, color: 'text-emerald-500' },
           { label: 'Team Velocity', value: '85%', icon: BarChart3, color: 'text-amber-500' },
           { label: 'Deadline Risks', value: '02', icon: AlertCircle, color: 'text-rose-500' },
         ].map((stat, i) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="glass-panel p-6 rounded-[32px] border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5"
           >
              <div className="flex items-center justify-between mb-4">
                 <div className={`h-10 w-10 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-white/5 ${stat.color}`}>
                    <stat.icon size={20} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly</span>
              </div>
              <p className="text-3xl font-display font-black italic text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{stat.label}</p>
           </motion.div>
         ))}
      </div>

      {/* Main Board Section */}
      <div className="glass-panel rounded-[48px] border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl">
               {(['board', 'list', 'timeline'] as const).map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     activeTab === tab 
                       ? 'bg-white dark:bg-luxury-blue text-luxury-blue dark:text-white shadow-lg' 
                       : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
            
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10 transition">
                  <Filter size={14} /> Filter
               </button>
               <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10 transition">
                  <Calendar size={14} /> Quarter 2
               </button>
            </div>
         </div>

         <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
               {projects.map(p => (
                 <motion.div
                   layout
                   key={p.id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="group p-8 bg-white dark:bg-luxury-black/40 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-luxury-blue/5 transition-all duration-500 relative overflow-hidden"
                 >
                    <div className="flex items-start justify-between mb-8">
                       <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                         p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                         p.status === 'On Hold' ? 'bg-amber-500/10 text-amber-500' : 'bg-luxury-blue/10 text-luxury-blue'
                       }`}>
                         {p.status}
                       </div>
                       <button className="text-slate-400 hover:text-luxury-blue transition-colors">
                          <MoreVertical size={18} />
                       </button>
                    </div>

                    <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white uppercase italic tracking-tight group-hover:text-luxury-blue transition-colors">{p.name}</h3>
                    
                    <div className="space-y-6 mb-8">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>Task Progress</span>
                          <span className="text-slate-900 dark:text-white">{p.progress}%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${p.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${
                              p.progress > 80 ? 'bg-emerald-500' : 'bg-luxury-blue'
                            }`}
                          />
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-white/5">
                       <div className="flex -space-x-3">
                          {p.team.map((m, i) => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-luxury-black bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400">
                               {m}
                            </div>
                          ))}
                          <div className="h-8 w-8 rounded-full border-2 border-white dark:border-luxury-black bg-luxury-blue flex items-center justify-center text-[10px] font-black text-white">
                             +
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={14} />
                          <span className="text-[10px] font-bold uppercase">{p.deadline}</span>
                       </div>
                    </div>

                    {/* Hover effect light */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-blue/10 rounded-full blur-[60px] translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
                 </motion.div>
               ))}
            </AnimatePresence>
            
            <button className="h-full min-h-[340px] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[40px] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-luxury-blue hover:border-luxury-blue/50 hover:bg-luxury-blue/5 transition-all group">
               <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={24} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Initialize New Operation</span>
            </button>
         </div>
      </div>
    </div>
  )
}
