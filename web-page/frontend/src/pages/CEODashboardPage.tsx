import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Target, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Zap,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { SectionCard } from '../components/ui/SectionCard';
import { WorkflowVisualizer } from '../components/ui/WorkflowVisualizer';
import type { User } from '../types';

export function CEODashboardPage({ user, platform }: { user: User, platform: any }) {
  const metrics = useMemo(() => {
    const liveMetrics = platform.dashboard?.metrics || [];
    const userCount = liveMetrics.find((m: any) => m.label === 'Total Employees')?.value || '248';
    const projectCount = liveMetrics.find((m: any) => m.label === 'Active Projects')?.value || '14';

    return [
      { label: 'Total Revenue', value: '$4.2M', trend: '+12%', icon: BarChart3, color: 'emerald' },
      { label: 'Active Workforce', value: userCount, trend: '+4', icon: Users, color: 'blue' },
      { label: 'Project Health', value: '94%', trend: '+2%', icon: ShieldCheck, color: 'purple' },
      { label: 'Market Reach', value: projectCount, trend: 'Global', icon: Globe, color: 'amber' },
    ];
  }, [platform]);

  return (
    <div className="space-y-6">
      {/* CEO Executive Header */}
      <section className="glass-panel p-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-8 bg-luxury-blue rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury-blue">Executive Oversight</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              Strategic <span className="text-luxury-blue">Command Center</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium max-w-xl">
              Welcome, {user.name}. Your enterprise is operating at 94% efficiency. Current strategic focus: <span className="text-white italic">AI Transformation & Market Expansion.</span>
            </p>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-luxury-blue hover:text-white transition-all shadow-xl shadow-white/5">
                New Strategic Initiative
             </button>
             <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                Export Annual Report
             </button>
          </div>
        </div>
        
        {/* Abstract background element */}
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-luxury-blue/20 to-transparent pointer-events-none" />
      </section>

      {/* High-Level Metrics */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="glass-panel p-6 hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-${m.color}-500/10 text-${m.color}-500`}>
                    <m.icon size={24} />
                </div>
                <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase">
                    {m.trend}
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{m.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{m.value}</p>
          </div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
        <div className="space-y-6">
          {/* Interactive Workflow Visualization */}
          <SectionCard title="Enterprise Workflow visualization" subtitle="Visualizing the path from Strategy to Results.">
            <div className="mt-4">
                <WorkflowVisualizer />
            </div>
          </SectionCard>

          {/* Strategic Initiatives */}
          <SectionCard title="Priority Initiatives" subtitle="High-impact projects currently in execution.">
             <div className="space-y-4">
                {[
                    { name: 'Global Infrastructure Expansion', owner: 'Alex Manager', budget: '$1.2M', status: 'In Progress', progress: 65 },
                    { name: 'AI Integration Phase 2', owner: 'Sarah Tech', budget: '$450K', status: 'On Track', progress: 88 },
                    { name: 'Sustainability Audit 2026', owner: 'Robert Fox', budget: '$120K', status: 'Reviewing', progress: 42 },
                ].map(item => (
                    <div key={item.name} className="p-5 rounded-3xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Lead: {item.owner} | Budget: {item.budget}</p>
                            </div>
                            <span className="px-3 py-1 bg-luxury-blue/10 text-luxury-blue rounded-full text-[9px] font-black uppercase tracking-widest">
                                {item.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-luxury-blue" style={{ width: `${item.progress}%` }} />
                            </div>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300">{item.progress}%</span>
                        </div>
                    </div>
                ))}
             </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
            {/* AI Strategic Advisory */}
            <div className="glass-panel p-6 bg-luxury-blue text-white shadow-2xl shadow-luxury-blue/20">
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={18} className="fill-white" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">AI Advisory</p>
                </div>
                <h3 className="text-lg font-black leading-tight uppercase italic mb-4">
                    Optimization <br/>Opportunity
                </h3>
                <p className="text-xs font-medium opacity-90 leading-relaxed italic">
                    "Detected 14% redundant spending in Cloud Infrastructure. Reallocating $200k to R&D could accelerate the AI Phase 2 delivery by 18 days."
                </p>
                <button className="mt-6 w-full py-3 bg-white text-luxury-blue rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                    Apply Optimization
                </button>
            </div>

            {/* Recent Global Signals */}
            <SectionCard title="Enterprise Signals" subtitle="Critical alerts from across departments.">
                <div className="space-y-4">
                    {[
                        { title: 'Budget Threshold Breached', dept: 'Marketing', time: '2m ago', level: 'critical' },
                        { title: 'New Senior Lead Hired', dept: 'Engineering', time: '45m ago', level: 'info' },
                        { title: 'Project Closure Requested', dept: 'Sales', time: '2h ago', level: 'warning' },
                    ].map((signal, i) => (
                        <div key={i} className="flex gap-4 items-start p-2">
                            <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                                signal.level === 'critical' ? 'bg-rose-500 animate-pulse' :
                                signal.level === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{signal.title}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{signal.dept} • {signal.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>
            
            {/* Market Performance */}
            <div className="glass-panel p-6 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Market Performance</p>
                    <Globe size={18} className="text-slate-400" />
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-4xl font-black text-slate-900 dark:text-white">82.4</p>
                    <p className="text-xs font-black text-emerald-500 mb-1 flex items-center">
                        <ArrowUpRight size={14} /> 5.2%
                    </p>
                </div>
                <div className="mt-4 h-16 flex items-end gap-1">
                    {[30, 45, 35, 55, 40, 65, 50, 70].map((h, i) => (
                        <div key={i} className="flex-1 bg-luxury-blue/20 rounded-t-sm group-hover:bg-luxury-blue transition-all duration-500" style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
