import React, { useMemo } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  BarChart2, 
  Zap,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { SectionCard } from '../components/ui/SectionCard';
import type { User } from '../types';

export function TeamLeadDashboardPage({ user, platform }: { user: User, platform: any }) {
  const stats = useMemo(() => {
    const liveMetrics = platform.dashboard?.metrics || [];
    const taskCount = liveMetrics.find((m: any) => m.label === 'Tasks in Progress')?.value || '15';

    return [
      { label: 'Team Velocity', value: '42 pts', icon: Zap, color: 'blue' },
      { label: 'Task Completion', value: '85%', icon: CheckCircle2, color: 'emerald' },
      { label: 'Avg Cycle Time', value: '3.2d', icon: Clock, color: 'purple' },
      { label: 'Open Blockers', value: '3', icon: AlertTriangle, color: 'rose' },
    ];
  }, [platform]);

  return (
    <div className="space-y-6">
      {/* Team Lead Header */}
      <section className="glass-panel p-8 relative overflow-hidden bg-gradient-to-br from-indigo-500/5 to-transparent">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-8 bg-indigo-500 rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Squad Leadership</p>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
              Team <span className="text-indigo-500">Lead Hub</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-xl">
              Hello, {user.name}. Your squad is currently 85% through the current sprint. 3 tasks require immediate clarification.
            </p>
          </div>
          <div className="flex gap-3">
             <button className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                Plan Next Sprint
             </button>
             <button className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-xl hover:text-indigo-500 transition-all">
                <MoreVertical size={18} />
             </button>
          </div>
        </div>
      </section>

      {/* Team Metrics */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel p-6">
            <div className={`p-3 w-fit rounded-2xl bg-${s.color}-500/10 text-${s.color}-500 mb-4`}>
                <s.icon size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{s.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
        <div className="space-y-6">
            {/* Squad Task List */}
            <SectionCard title="Active Sprint Backlog" subtitle="Current tasks assigned to your squad members.">
                <div className="space-y-3">
                    {[
                        { title: 'API Authentication Hardening', member: 'Sarah W.', priority: 'High', status: 'In Review' },
                        { title: 'Landing Page UI Refinement', member: 'Michael C.', priority: 'Medium', status: 'Doing' },
                        { title: 'Database Migration Script', member: 'Robert F.', priority: 'Critical', status: 'Blocked' },
                        { title: 'Mobile App Asset Export', member: 'Sarah W.', priority: 'Low', status: 'Doing' },
                    ].map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-[10px] font-black ${
                                    task.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
                                    task.priority === 'High' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {task.priority[0]}
                                </div>
                                <div>
                                    <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase">{task.title}</h5>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Assigned to: {task.member}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                    task.status === 'Blocked' ? 'text-rose-500' :
                                    task.status === 'In Review' ? 'text-indigo-500' : 'text-slate-400'
                                }`}>
                                    {task.status}
                                </span>
                                <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MessageSquare size={16} className="text-slate-400 hover:text-indigo-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Team Performance Heatmap Placeholder */}
            <SectionCard title="Weekly Productivity" subtitle="Task throughput by team member.">
                <div className="h-48 flex items-end gap-2 px-2">
                    {[65, 80, 45, 90, 75, 60, 85].map((h, i) => (
                        <div key={i} className="flex-1 space-y-2">
                            <div className="h-full bg-indigo-500/20 rounded-t-lg relative overflow-hidden" style={{ height: `${h}%` }}>
                                <div className="absolute bottom-0 w-full bg-indigo-500 transition-all duration-1000" style={{ height: '70%' }} />
                            </div>
                            <p className="text-[8px] font-black text-slate-400 text-center uppercase">M T W T F S S'[i]</p>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>

        <div className="space-y-6">
            {/* Squad Members */}
            <SectionCard title="Squad Members" subtitle="Real-time availability status.">
                <div className="space-y-4">
                    {[
                        { name: 'Sarah Wilson', role: 'Backend', status: 'Active', load: '85%' },
                        { name: 'Michael Chen', role: 'Frontend', status: 'Meeting', load: '60%' },
                        { name: 'Robert Fox', role: 'DevOps', status: 'Offline', load: '40%' },
                    ].map((member, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs font-black text-slate-500">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase">{member.role}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-[9px] font-black uppercase ${member.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {member.status}
                                </p>
                                <p className="text-[8px] text-slate-400 mt-0.5">Load: {member.load}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Reported Blockers */}
            <div className="glass-panel p-5 bg-rose-500 text-white">
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Active Blockers</p>
                </div>
                <div className="space-y-3">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                        <p className="text-[10px] font-bold uppercase mb-1">Infrastructure Delay</p>
                        <p className="text-[10px] opacity-80 leading-relaxed italic">"Waiting for AWS instance approval from IT Dept. Impacting 2 tasks."</p>
                    </div>
                </div>
                <button className="w-full py-2.5 mt-4 bg-white text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest">
                    Escalate to Manager
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
