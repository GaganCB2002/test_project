import React, { useState, useEffect, useRef, useMemo } from 'react'
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  FileText, 
  CalendarCheck, 
  Sparkles, 
  Target,
  Zap,
  AlertCircle,
  Play,
  Pause,
  Timer
} from 'lucide-react'
import { SectionCard } from '../components/ui/SectionCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { dateLabel } from '../lib/format'
import { api } from '../api/client'
import { socket } from '../api/socket'
import type { PlatformData, User } from '../types'

export function EmployeeDashboardPage({ platform, user, token }: { platform: PlatformData, user: User, token: string }) {
  const [activeTask, setActiveTask] = useState<{ id: string, title: string, project: string } | null>({
    id: 'task-102',
    title: 'Frontend Component Refactoring',
    project: 'AuraHR Core'
  });
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(14200); // 3h 56m in seconds

  useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const myTasks = useMemo(() => {
    return (platform.projects?.tasks || []).filter((t: any) => t.employeeName === user.name)
      .map((t: any) => ({
        id: t.id,
        title: t.title,
        project: t.project,
        priority: 'Medium', // Default if not in model
        status: t.status,
        deadline: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'TBD'
      }));
  }, [platform.projects?.tasks, user.name]);

  // Fallback if no live tasks found
  const displayedTasks = myTasks.length > 0 ? myTasks : [
    { id: '102', title: 'Frontend Component Refactoring', project: 'AuraHR Core', priority: 'High', status: 'In Progress', deadline: 'Today' },
    { id: '105', title: 'Unit Test Coverage Increase', project: 'Cloud Infrastructure', priority: 'Medium', status: 'Todo', deadline: 'Tomorrow' },
  ];

  return (
    <div className="space-y-6">
      {/* Employee Context Header */}
      <section className="glass-panel p-8 bg-white dark:bg-slate-900 border-none relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-luxury-blue fill-luxury-blue" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Individual Contributor Hub</p>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
               Welcome, <span className="text-luxury-blue">{user.name}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
               You have 3 tasks assigned for this sprint. Focus: <span className="text-slate-900 dark:text-white font-bold uppercase italic underline decoration-luxury-blue underline-offset-4">Frontend Component Refactoring</span>
            </p>
          </div>
          <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-slate-400">Personal Performance</p>
                  <p className="text-lg font-black text-emerald-500">92.4</p>
              </div>
              <div className="h-full w-px bg-slate-200 dark:bg-white/10" />
              <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-slate-400">Tasks Done</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">12</p>
              </div>
          </div>
        </div>
      </section>

      {/* Task Execution & Timer */}
      <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
        <div className="space-y-6">
           <SectionCard title="Task Execution Engine" subtitle="Real-time work tracking and focus.">
                <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-blue mb-1">Active Focus</p>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">{activeTask?.title}</h3>
                                <p className="text-xs text-slate-400 font-medium">{activeTask?.project}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Session Time</p>
                                <p className="text-3xl font-black font-mono text-white mt-1 tabular-nums">{formatTime(timeElapsed)}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setTimerRunning(!timerRunning)}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    timerRunning ? 'bg-rose-500 text-white' : 'bg-luxury-blue text-white'
                                }`}
                            >
                                {timerRunning ? <><Pause size={16} fill="currentColor" /> Pause Focus</> : <><Play size={16} fill="currentColor" /> Start Focus</>}
                            </button>
                            <button className="px-6 py-3 bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                                Log Progress
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all ml-auto">
                                <AlertCircle size={16} /> Raise Issue
                            </button>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-luxury-blue/10 to-transparent pointer-events-none" />
                </div>
           </SectionCard>

           <SectionCard title="My Work Queue" subtitle="Tasks assigned to you by your Manager / Team Lead.">
              <div className="space-y-3">
                  {displayedTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm ${
                                  task.id === activeTask?.id ? 'bg-luxury-blue text-white shadow-lg shadow-luxury-blue/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                              }`}>
                                  {task.id}
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{task.title}</p>
                                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{task.project} • Deadline: {task.deadline}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                   task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 
                                   task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                               }`}>
                                   {task.priority}
                               </span>
                               <button className="p-2 text-slate-400 hover:text-luxury-blue transition-colors">
                                   <Sparkles size={16} />
                               </button>
                          </div>
                      </div>
                  ))}
              </div>
           </SectionCard>
        </div>

        <div className="space-y-6">
           {/* Work Progress Signal */}
           <div className="glass-panel p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Sprint Progress</p>
                <div className="relative h-32 w-32 mx-auto">
                    <svg className="h-full w-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-white/5" />
                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="351.85" strokeDashoffset={351.85 * (1 - 0.72)} className="text-luxury-blue transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-black text-slate-900 dark:text-white">72%</p>
                        <p className="text-[8px] font-black uppercase text-slate-500">Completed</p>
                    </div>
                </div>
                <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                        <span className="text-slate-500">Planned Velocity</span>
                        <span className="text-slate-900 dark:text-white">12 pts</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                        <span className="text-slate-500">Current Burndown</span>
                        <span className="text-emerald-500">Ahead</span>
                    </div>
                </div>
           </div>

           {/* Time Log History */}
           <SectionCard title="Recent Activity" subtitle="Your work logs from the last 24h.">
                <div className="space-y-4">
                    {[
                        { activity: 'Coded: Auth Logic', duration: '2h 15m', time: '9:30 AM' },
                        { activity: 'Meeting: Squad Sync', duration: '45m', time: '1:00 PM' },
                        { activity: 'Review: Pull Request #42', duration: '1h 10m', time: '3:15 PM' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] group">
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-luxury-blue" />
                                <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-luxury-blue transition-colors">{item.activity}</span>
                            </div>
                            <span className="text-slate-400 font-medium">{item.duration}</span>
                        </div>
                    ))}
                </div>
           </SectionCard>
        </div>
      </div>
    </div>
  )
}
