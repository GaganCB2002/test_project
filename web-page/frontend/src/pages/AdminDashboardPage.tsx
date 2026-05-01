import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Activity, 
  Shield, 
  Lock, 
  Settings, 
  BarChart3, 
  FileText, 
  Bell, 
  Plus, 
  Search, 
  MoreVertical, 
  ChevronRight, 
  Filter, 
  Download, 
  Zap, 
  HardDrive, 
  Cpu, 
  Globe, 
  Database,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Cloud,
  Eye,
  Trash2,
  Edit,
  UserPlus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { SectionCard } from '../components/ui/SectionCard';

export function AdminDashboardPage({ user, platform }: { user: any, platform: any }) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const stats = useMemo(() => {
    const metrics = platform.dashboard?.metrics || [];
    return [
      { label: 'Total Users', value: metrics.find((m:any) => m.id === 'headcount')?.value || '1,248', trend: '+12.5%', icon: Users, color: 'purple' },
      { label: 'Active Projects', value: metrics.find((m:any) => m.id === 'projects')?.value || '85', trend: '+8.2%', icon: Briefcase, color: 'blue' },
      { label: 'Total Tasks', value: metrics.find((m:any) => m.id === 'tasks')?.value || '3,652', trend: '+15.3%', icon: Activity, color: 'orange' },
      { label: 'Tasks Completed', value: '2,456', trend: '+15.3%', icon: CheckCircle2, color: 'emerald' },
      { label: 'Total Revenue', value: '$256,850', trend: '+14.7%', icon: DollarSign, color: 'red' },
      { label: 'System Uptime', value: '99.9%', trend: '+0.5%', icon: Cpu, color: 'blue' },
    ];
  }, [platform]);

  const projectStatusData = [
    { name: 'Completed', value: 26, color: '#10b981' },
    { name: 'In Progress', value: 31, color: '#3b82f6' },
    { name: 'On Hold', value: 10, color: '#f59e0b' },
    { name: 'Cancelled', value: 8, color: '#ef4444' },
    { name: 'Not Started', value: 10, color: '#6366f1' },
  ];

  const taskOverviewData = [
    { name: '1 May', tasks: 250 }, { name: '8 May', tasks: 450 }, { name: '15 May', tasks: 400 },
    { name: '22 May', tasks: 600 }, { name: '29 May', tasks: 736 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, idx) => (
              <div key={idx} className="glass-panel p-5 dark:border-white/5 hover:border-luxury-blue/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <stat.icon size={48} />
                  </div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-2.5 rounded-xl bg-luxury-blue/10 text-luxury-blue">
                          <stat.icon size={18} />
                      </div>
                      <span className="text-[10px] font-black text-emerald-500">{stat.trend}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MAIN CHART */}
          <div className="lg:col-span-8 glass-panel p-8 dark:border-white/5">
              <div className="flex items-center justify-between mb-10">
                  <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">System Output Signals</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Cross-departmental performance metrics</p>
                  </div>
                  <div className="flex gap-2">
                      <button className="px-4 py-2 bg-luxury-blue text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-luxury-blue/20">Real-time</button>
                      <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-colors">Historical</button>
                  </div>
              </div>
              <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={taskOverviewData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                              itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                          />
                          <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 4, fill: '#fff' }} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* DISTRIBUTION PIE */}
          <div className="lg:col-span-4 glass-panel p-8 dark:border-white/5 flex flex-col items-center justify-center">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-10">Project Topology</h3>
              <div className="h-[250px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={projectStatusData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                              {projectStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-4xl font-black text-slate-900 dark:text-white italic">85</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active</p>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-10">
                  {projectStatusData.map(item => (
                      <div key={item.name} className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <div className="min-w-0">
                              <p className="text-[10px] font-black text-slate-500 uppercase truncate">{item.name}</p>
                              <p className="text-xs font-black text-slate-900 dark:text-white">{item.value}%</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* USER MANAGEMENT PREVIEW */}
          <SectionCard title="Infrastructure Nodes" subtitle="Global user and access management." className="lg:col-span-2">
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                              <th className="pb-6">Operator Identity</th>
                              <th className="pb-6">Access Protocol</th>
                              <th className="pb-6">System Status</th>
                              <th className="pb-6">Activity Load</th>
                              <th className="pb-6 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {[
                              { name: 'Alex Thompson', email: 'alex@aurahr.io', role: 'Super Admin', status: 'Online', load: 85, color: 'blue' },
                              { name: 'Sarah Chen', email: 'sarah@aurahr.io', role: 'Security lead', status: 'Active', load: 62, color: 'purple' },
                              { name: 'Michael Ross', email: 'mike@aurahr.io', role: 'DevOps', status: 'Busy', load: 94, color: 'orange' },
                              { name: 'Emily Blunt', email: 'emily@aurahr.io', role: 'HR Director', status: 'Online', load: 45, color: 'emerald' },
                          ].map((node, i) => (
                              <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                  <td className="py-5">
                                      <div className="flex items-center gap-3">
                                          <div className={`h-10 w-10 rounded-2xl bg-luxury-blue/10 flex items-center justify-center font-black text-sm text-luxury-blue`}>{node.name[0]}</div>
                                          <div>
                                              <p className="text-xs font-black text-slate-900 dark:text-white">{node.name}</p>
                                              <p className="text-[9px] font-bold text-slate-500">{node.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="py-5">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{node.role}</span>
                                  </td>
                                  <td className="py-5">
                                      <div className="flex items-center gap-2">
                                          <div className={`h-2 w-2 rounded-full ${node.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                          <span className="text-[10px] font-black uppercase text-slate-400">{node.status}</span>
                                      </div>
                                  </td>
                                  <td className="py-5">
                                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                          <div className={`h-full bg-luxury-blue`} style={{ width: `${node.load}%` }} />
                                      </div>
                                  </td>
                                  <td className="py-5 text-right">
                                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"><Settings size={14} className="text-slate-500" /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </SectionCard>

          {/* SYSTEM LOGS */}
          <div className="glass-panel p-8 dark:border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Global Activity</h3>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-luxury-blue/10 text-luxury-blue">
                      <Activity size={16} />
                  </div>
              </div>
              <div className="space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                  {[
                      { type: 'Auth', user: 'Alex T.', action: 'Authenticated session', time: '2 min ago', color: 'blue' },
                      { type: 'Data', user: 'Sarah C.', action: 'Updated payroll schema', time: '15 min ago', color: 'purple' },
                      { type: 'System', user: 'Kernel', action: 'Routine security scan', time: '45 min ago', color: 'emerald' },
                      { type: 'Access', user: 'Unknown', action: 'Blocked login attempt', time: '1 hr ago', color: 'red' },
                      { type: 'Data', user: 'Michael R.', action: 'Archived project data', time: '2 hr ago', color: 'orange' },
                  ].map((log, i) => (
                      <div key={i} className="flex gap-4 group">
                          <div className={`h-10 w-10 shrink-0 rounded-2xl bg-slate-100 dark:bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500`}>{log.user[0]}</div>
                          <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-luxury-blue/10 text-luxury-blue`}>{log.type}</span>
                                  <span className="text-[8px] font-black text-slate-600 uppercase">{log.time}</span>
                              </div>
                              <p className="text-[11px] font-black text-slate-900 dark:text-white mt-1.5 truncate group-hover:text-luxury-blue transition-colors">{log.action}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 italic">By {log.user}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
