import { 
  ShieldCheck, 
  Users, 
  Terminal, 
  LifeBuoy, 
  MapPin, 
  ArrowUpRight,
  Activity,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Bell,
  AlertTriangle,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  PieChart as PieChartIcon,
  Monitor,
  MoreVertical,
  Plus,
  Settings
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts'
import type { User } from '../types'
import { checkServices, type ServiceStatus } from '../lib/serviceHealth'
import { getModuleUrl } from '../lib/roleRouting'

interface MasterDashboardPageProps {
  user: User
  onLogout: () => void
}

const productivityData = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 75 },
  { name: 'Wed', value: 68 },
  { name: 'Thu', value: 85 },
  { name: 'Fri', value: 78 },
  { name: 'Sat', value: 92 },
  { name: 'Sun', value: 88 },
]

const activityData = [
  { name: 'Productive', value: 65, color: '#8b5cf6' },
  { name: 'Neutral', value: 23, color: '#f59e0b' },
  { name: 'Unproductive', value: 12, color: '#ef4444' },
]

const topPerformers = [
  { name: 'Sophia Williams', role: 'UI/UX Designer', score: '98%', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
  { name: 'Michael Brown', role: 'Frontend Developer', score: '94%', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { name: 'David Miller', role: 'Backend Developer', score: '91%', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
]

export function MasterDashboardPage({ user, onLogout }: MasterDashboardPageProps) {
  const navigate = useNavigate()
  const [downServices, setDownServices] = useState<ServiceStatus[]>([])

  useEffect(() => {
    const verifyConnectivity = async () => {
      const results = await checkServices()
      const down = results.filter(s => s.status === 'DOWN')
      setDownServices(down)
    }
    verifyConnectivity()
  }, [])

  const modules = [
    {
      id: 'hr',
      name: 'HR Operations',
      description: 'Manage recruitment and lifecycle.',
      icon: Users,
      color: 'bg-indigo-500',
      action: () => navigate('/hr-dashboard'),
      roles: ['HR', 'CEO', 'ADMIN', 'MANAGER']
    },
    {
      id: 'employee',
      name: 'Employee Hub',
      description: 'Profile and collaboration.',
      icon: UserIcon,
      color: 'bg-emerald-500',
      action: () => window.location.assign(getModuleUrl('employee', localStorage.getItem('aurahr-token'))),
      roles: ['EMPLOYEE', 'HR', 'CEO', 'ADMIN', 'MANAGER', 'TECH_LEAD', 'LEAD']
    },
    {
      id: 'tech',
      name: 'Tech Analytics',
      description: 'Code metrics and velocity.',
      icon: Terminal,
      color: 'bg-orange-500',
      action: () => window.location.assign(getModuleUrl('tech', localStorage.getItem('aurahr-token'))),
      roles: ['TECH_LEAD', 'LEAD', 'CEO', 'ADMIN']
    },
    {
      id: 'helpdesk',
      name: 'IT Helpdesk',
      description: 'Support and tickets.',
      icon: LifeBuoy,
      color: 'bg-teal-500',
      action: () => window.location.assign(getModuleUrl('helpdesk', localStorage.getItem('aurahr-token'))),
      roles: ['CEO', 'ADMIN', 'HR', 'MANAGER', 'TECH_LEAD', 'LEAD', 'EMPLOYEE']
    }
  ]

  const userRole = (user?.role || '').toUpperCase().replace(' ', '_')
  const allowedModules = modules.filter(m => {
    if (userRole === 'CEO' || userRole === 'ADMIN') return true
    return m.roles.some(r => {
      const normalizedR = r.toUpperCase().replace(' ', '_')
      return normalizedR === userRole || (normalizedR === 'LEAD' && userRole === 'TECH_LEAD')
    })
  })

  return (
    <div className="space-y-8 pb-12">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Employees', value: '128', trend: '+12.5%', icon: Users, color: 'text-purple-400' },
          { label: 'Productivity', value: '87%', trend: '+8.4%', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Work Hours', value: '2,543h', trend: '+15.2%', icon: Clock, color: 'text-blue-400' },
          { label: 'Attendance', value: '96%', trend: '+6.5%', icon: CheckCircle2, color: 'text-amber-400' },
        ].map((card, i) => (
          <div key={i} className="glass-panel p-6 bg-white/5 border-white/5 rounded-[24px] hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">{card.value}</span>
              <span className="text-[10px] font-bold text-emerald-500 mb-1.5">{card.trend}</span>
            </div>
            <p className="mt-2 text-[10px] text-slate-600 font-bold uppercase">vs last week</p>
          </div>
        ))}
      </div>

      {/* Middle Section: Charts & Top Performers */}
      <div className="grid lg:grid-cols-[1.5fr_0.5fr] gap-8">
        <div className="glass-panel p-8 bg-white/5 border-white/5 rounded-[32px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-100 uppercase tracking-widest text-sm">Productivity Trend</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs font-bold text-slate-400 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8 bg-white/5 border-white/5 rounded-[32px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-100 uppercase tracking-widest text-sm">Top Performers</h3>
            <button className="text-[10px] font-bold text-purple-400 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {topPerformers.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={p.img} className="h-10 w-10 rounded-xl bg-slate-800" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold truncate">{p.role}</p>
                </div>
                <span className="text-sm font-bold text-emerald-400">{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Modules & Activity Breakdown */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Modules List */}
        <div className="lg:col-span-1 glass-panel p-8 bg-white/5 border-white/5 rounded-[32px]">
          <h3 className="font-bold mb-8 text-slate-100 uppercase tracking-widest text-sm">Quick Access Hub</h3>
          <div className="grid gap-4">
            {allowedModules.map((m) => (
              <button 
                key={m.id}
                onClick={m.action}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
              >
                <div className={`h-10 w-10 rounded-xl ${m.color} flex items-center justify-center text-white`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold">{m.name}</p>
                  <p className="text-[10px] text-slate-500">{m.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-white transition" />
              </button>
            ))}
            <button className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/10 text-slate-500 hover:text-white transition">
              <Plus className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Add Module</span>
            </button>
          </div>
        </div>

        {/* Activity Breakdown */}
        <div className="glass-panel p-8 bg-white/5 border-white/5 rounded-[32px]">
           <h3 className="font-bold mb-8 text-slate-100 uppercase tracking-widest text-sm">Activity Breakdown</h3>
           <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">87%</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase">Avg Score</span>
              </div>
           </div>
           <div className="mt-8 space-y-3">
             {activityData.map(item => (
               <div key={item.name} className="flex items-center justify-between text-[10px] font-bold">
                 <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
                   <span className="text-slate-400 uppercase tracking-widest">{item.name}</span>
                 </div>
                 <span>{item.value}%</span>
               </div>
             ))}
           </div>
        </div>

        {/* Most Used Apps */}
        <div className="glass-panel p-8 bg-white/5 border-white/5 rounded-[32px]">
           <h3 className="font-bold mb-8 text-slate-100 uppercase tracking-widest text-sm">Most Used Apps</h3>
           <div className="grid grid-cols-2 gap-4">
             {[
               { name: 'Chrome', usage: '38%', color: 'bg-blue-500/10' },
               { name: 'VS Code', usage: '22%', color: 'bg-sky-500/10' },
               { name: 'Figma', usage: '16%', color: 'bg-orange-500/10' },
               { name: 'Slack', usage: '14%', color: 'bg-emerald-500/10' },
             ].map(app => (
               <div key={app.name} className={`p-4 rounded-2xl ${app.color} border border-white/5`}>
                 <div className="flex justify-between items-center mb-2">
                   <Monitor className="h-4 w-4 opacity-50" />
                   <span className="text-[10px] font-bold">{app.usage}</span>
                 </div>
                 <p className="text-xs font-bold">{app.name}</p>
               </div>
             ))}
           </div>
           <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-100">System Alert</p>
                  <p className="text-[10px] text-slate-500">Unproductive apps detected (12%)</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Service Status Bar */}
      <div className="flex items-center justify-center gap-8 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
        <span className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${downServices.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
          HR Gateway {downServices.some(s => s.port === 8081) ? 'Offline' : 'Online'}
        </span>
        <span className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${downServices.some(s => s.port === 8000) ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
          Employee Hub {downServices.some(s => s.port === 8000) ? 'Offline' : 'Online'}
        </span>
        <span className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${downServices.some(s => s.port === 5000) ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
          Lead Analytics {downServices.some(s => s.port === 5000) ? 'Offline' : 'Online'}
        </span>
      </div>
    </div>
  );
}
