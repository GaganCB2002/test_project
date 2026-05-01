import { 
  Bot, 
  CalendarClock, 
  CheckCheck, 
  Code2, 
  GitBranch, 
  LayoutDashboard, 
  MessageSquare, 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  TrendingUp, 
  TriangleAlert, 
  UsersRound 
} from 'lucide-react';
import React, { useMemo } from 'react';
import type { User } from '../types';

interface TechLeadDashboardProps {
  user: User;
}

export default function TechLeadDashboard({ user }: TechLeadDashboardProps) {
  const stats = useMemo(() => [
    { label: 'Project Velocity', value: '84%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Active Sprints', value: '3', icon: Rocket, color: 'text-brand' },
    { label: 'Pending Reviews', value: '12', icon: GitBranch, color: 'text-amber-500' },
    { label: 'System Health', value: 'Optimal', icon: ShieldCheck, color: 'text-indigo-500' },
  ], []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
            <Terminal className="h-4 w-4" />
            Engineering Command Center
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Tech Lead Dashboard • Overseeing system architecture and delivery flow.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-coral/5 blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-panel p-6 transition-all hover:translate-y-[-2px]">
              <div className="flex items-center gap-4">
                <div className={`rounded-2xl bg-slate-50 p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-950">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Workflow Section */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-brand" />
                Active Workstreams
              </h2>
              <button className="text-sm font-semibold text-brand hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Core API Hardening', status: 'In Review', progress: 75, risk: 'Low' },
                { name: 'Unified Dashboard Integration', status: 'In Progress', progress: 45, risk: 'Medium' },
                { name: 'AI Attrition Model v2', status: 'Blocked', progress: 30, risk: 'High' },
              ].map((project) => (
                <div key={project.name} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">{project.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      project.risk === 'High' ? 'bg-rose-100 text-rose-700' : 
                      project.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {project.risk} Risk
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-sm font-medium text-slate-500">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2 mb-6">
              <Code2 className="h-5 w-5 text-brand" />
              Code Quality Signals
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <GitBranch className="h-5 w-5 text-amber-400" />
                  <span className="font-semibold">Open Pull Requests</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">#142 Payment Fix</span>
                    <span className="text-amber-400">Review Required</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">#139 Auth Refactor</span>
                    <span className="text-emerald-400">Passing Tests</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Bot className="h-5 w-5 text-brand" />
                  <span className="font-semibold">AI Insights</span>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "Candidate #42 shows high potential for the Senior Backend role based on current team skill gaps."
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Activity Section */}
        <div className="space-y-6">
          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-brand" />
              Team Status
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Sarah Chen', role: 'Sr. Frontend', status: 'online' },
                { name: 'Alex Rivera', role: 'DevOps', status: 'busy' },
                { name: 'James Wilson', role: 'Backend', status: 'online' },
              ].map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-xs font-bold text-brand">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${member.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-brand" />
              Recent Signal
            </h2>
            <div className="space-y-4 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100" />
              {[
                { actor: 'System', text: 'Deployment to staging successful', time: '12m ago' },
                { actor: 'Sarah', text: 'Merged PR #138', time: '45m ago' },
                { actor: 'Security', text: 'Critical patch applied', time: '2h ago' },
              ].map((activity, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-[14px] top-1.5 h-2 w-2 rounded-full bg-brand ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-900">{activity.actor}</p>
                  <p className="text-sm text-slate-600">{activity.text}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">{activity.time}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
