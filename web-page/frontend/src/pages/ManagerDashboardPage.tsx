import React, { useMemo, useState } from 'react';
import { 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  Briefcase,
  Calendar,
  MessageSquare,
  Search,
  Bell,
  Settings,
  LayoutDashboard,
  FileText,
  ChevronRight,
  MoreVertical,
  Plus,
  Send,
  Eye,
  Filter,
  DollarSign
} from 'lucide-react';
import { SectionCard } from '../components/ui/SectionCard';
import type { User } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

export function ManagerDashboardPage({ user, platform }: { user: User, platform: any }) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const stats = useMemo(() => {
    const liveMetrics = platform.dashboard?.metrics || [];
    const userCount = liveMetrics.find((m: any) => m.id === 'headcount')?.value || '45';
    const projectCount = liveMetrics.find((m: any) => m.id === 'projects')?.value || '12';
    const taskCount = liveMetrics.find((m: any) => m.id === 'tasks')?.value || '8';

    return [
      { id: '1', label: 'Total Team', value: userCount, trend: '+12.5%', icon: Users, color: 'blue' },
      { id: '2', label: 'Active Projects', value: projectCount, trend: '+8.2%', icon: Briefcase, color: 'amber' },
      { id: '3', label: 'Tasks Completed', value: '2,456', trend: '+18.7%', icon: CheckCircle2, color: 'emerald' },
      { id: '4', label: 'Pending Tasks', value: taskCount, trend: '-6.4%', icon: Clock, color: 'rose' },
      { id: '5', label: 'Revenue Target', value: '$48,650', trend: '+15.3%', icon: DollarSign, color: 'purple' },
    ];
  }, [platform]);

  const trendData = platform.dashboard?.productivityTrend || [
    { label: '1 May', value: 40 }, { label: '6 May', value: 35 }, { label: '11 May', value: 55 },
    { label: '16 May', value: 48 }, { label: '21 May', value: 70 }, { label: '26 May', value: 65 },
    { label: '31 May', value: 73 },
  ];

  const statusData = [
    { name: 'Completed', value: 12, color: '#10b981' },
    { name: 'In Progress', value: 14, color: '#3b82f6' },
    { name: 'Pending', value: 4, color: '#f59e0b' },
    { name: 'On Hold', value: 2, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map(stat => (
              <div key={stat.id} className="glass-panel p-5 dark:border-white/5 hover:border-luxury-blue/30 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-luxury-blue/10 text-luxury-blue group-hover:scale-110 transition-transform`}>
                          <stat.icon size={20} />
                      </div>
                      <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {stat.trend}
                      </span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LINE CHART */}
          <div className="lg:col-span-2 glass-panel p-6 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Team Productivity Trend</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Efficiency Signal Tracking</p>
                  </div>
                  <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-[10px] font-black uppercase p-2 outline-none">
                      <option>This Month</option>
                  </select>
              </div>
              <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                          <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                              contentStyle={{ backgroundColor: '#11141b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                              itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                          />
                          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* PIE CHART */}
          <div className="glass-panel p-6 dark:border-white/5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 text-center">Project Load Distribution</h3>
              <div className="h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                              {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">32</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase">Projects</p>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                  {statusData.map(item => (
                      <div key={item.name} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] font-bold text-slate-500">{item.name}</span>
                          <span className="text-[10px] font-black text-slate-900 dark:text-white ml-auto">{item.value}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* PROJECTS TABLE */}
      <SectionCard title="Active Workstreams" subtitle="Managerial oversight of all operational tasks.">
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="border-b border-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <th className="pb-4">Workstream</th>
                          <th className="pb-4">Team</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4">Progress</th>
                          <th className="pb-4">Deadline</th>
                          <th className="pb-4 text-right">Control</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {[
                          { name: 'Core Infrastructure Sync', team: 4, status: 'In Progress', progress: 75, deadline: '20 Jun', priority: 'High', color: 'blue' },
                          { name: 'Security Perimeter Audit', team: 3, status: 'Review', progress: 60, deadline: '15 Jul', priority: 'Medium', color: 'amber' },
                          { name: 'Frontend Refactoring', team: 5, status: 'Completed', progress: 100, deadline: '10 May', priority: 'Low', color: 'emerald' },
                          { name: 'Database Optimization', team: 2, status: 'Pending', progress: 25, deadline: '30 Jun', priority: 'High', color: 'rose' },
                      ].map((project, idx) => (
                          <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 text-xs font-bold text-slate-900 dark:text-white">{project.name}</td>
                              <td className="py-4">
                                  <div className="flex -space-x-2">
                                      {[1, 2, 3].map(i => <div key={i} className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 border border-white flex items-center justify-center text-[8px] font-black">U{i}</div>)}
                                  </div>
                              </td>
                              <td className="py-4">
                                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                    project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-luxury-blue/10 text-luxury-blue'
                                  }`}>
                                      {project.status}
                                  </span>
                              </td>
                              <td className="py-4 w-48">
                                  <div className="flex items-center gap-3">
                                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div className={`h-full bg-luxury-blue`} style={{ width: `${project.progress}%` }} />
                                      </div>
                                      <span className="text-[10px] font-black">{project.progress}%</span>
                                  </div>
                              </td>
                              <td className="py-4 text-[10px] font-bold text-slate-500">{project.deadline}</td>
                              <td className="py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"><Eye size={14} /></button>
                                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-luxury-blue"><Plus size={14} /></button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </SectionCard>
    </div>
  );
}
