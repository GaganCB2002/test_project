import {
  Activity,
  BadgeIndianRupee,
  BriefcaseBusiness,
  ChartColumn,
  CheckCircle,
  ClipboardCheck,
  DoorOpen,
  FileWarning,
  Folder,
  Gauge,
  LayoutDashboard,
  Layers,
  LifeBuoy,
  Mail,
  Menu,
  MessageSquare,
  Moon,
  Network,
  ShieldCheck,
  SmilePlus,
  Sun,
  Terminal,
  TimerReset,
  UserRoundCog,
  UsersRound,
  Bell,
  Settings,
  LogOut,
  User as UserIcon,
  Target,
  TrendingUp,
  Sparkles,
  Map,
  Zap,
  Cpu,
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Shield
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, type ReactNode } from 'react'
import { socket } from '../../api/socket'
import type { Role, User } from '../../types'
import { getModuleUrl } from '../../lib/roleRouting'

type NavItem = {
  to: string
  label: string
  icon: any
  roles: Role[]
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Master Hub', icon: Layers, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'Marketing'] },
  { to: '/hr-dashboard', label: 'HR Operations', icon: LayoutDashboard, roles: ['CEO', 'HR', 'Manager', 'Lead'] },
  { to: '__employee__', label: 'Employee Hub', icon: UserIcon, roles: ['Employee', 'CEO', 'HR', 'Manager', 'Lead'] },
  { to: '__tech__', label: 'Tech Lead Hub', icon: Terminal, roles: ['Lead', 'CEO', 'ADMIN'] },
  { to: '/analysis-sync', label: 'Tech Lead Analysis', icon: Cpu, roles: ['Lead', 'CEO', 'ADMIN'] },
  { to: '/profile', label: 'My Profile', icon: UserRoundCog, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'Marketing'] },
  { to: '/chat', label: 'Live Chat', icon: MessageSquare, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'Marketing'] },
  { to: '/mail', label: 'Internal Mail', icon: Mail, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'Marketing'] },
  { to: '/meetings', label: 'Video Meetings', icon: Terminal, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'Marketing'] },
  { to: '/attendance', label: 'Attendance', icon: TimerReset, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee'] },
  { to: '/feed', label: 'Live Activity Feed', icon: Activity, roles: ['CEO', 'HR', 'Manager', 'Lead'] },
  { to: '/recruitment', label: 'Recruitment', icon: BriefcaseBusiness, roles: ['CEO', 'HR', 'Manager', 'Lead'] },
  { to: '/allocation', label: 'Resource Allocation', icon: Layers, roles: ['CEO', 'HR', 'Manager', 'Lead'] },
  { to: '/leave-approvals', label: 'Leave Approvals', icon: FileWarning, roles: ['CEO', 'HR', 'Manager', 'Lead'] },
  { to: '/people', label: 'Employee Mgmt', icon: UsersRound, roles: ['CEO', 'HR', 'Manager', 'Lead'] },
  { to: '/onboarding', label: 'Onboarding', icon: ClipboardCheck, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee'] },
  { to: '/documentation', label: 'Documentation', icon: Folder, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee'] },
  { to: '/payroll', label: 'Payroll', icon: BadgeIndianRupee, roles: ['CEO', 'HR', 'Manager'] },
  { to: '/performance', label: 'Performance', icon: Gauge, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee'] },
  { to: '/projects', label: 'Projects', icon: Activity, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee'] },
  { to: '/engagement', label: 'Engagement', icon: SmilePlus, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee'] },
  { to: '/compliance', label: 'Compliance', icon: ShieldCheck, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee'] },
  { to: '__helpdesk__', label: 'IT Help Desk', icon: LifeBuoy, roles: ['CEO', 'HR', 'Manager', 'Lead', 'Employee'] },
  { to: '/exit', label: 'Exit', icon: DoorOpen, roles: ['CEO', 'HR', 'Manager'] },
  { to: '/budget', label: 'Budget', icon: ChartColumn, roles: ['CEO', 'HR'] },
  { to: '/analysis-sync', label: 'Engineering Sync', icon: Terminal, roles: ['CEO', 'HR'] },
  { to: '/analytics', label: 'Analytics', icon: Network, roles: ['CEO', 'HR', 'Manager', 'Lead'] },
  { to: '/live-tracking', label: 'Live Tracking', icon: Map, roles: ['CEO', 'HR', 'Manager', 'Lead'] },
  { to: '/marketing-hub', label: 'Marketing Hub', icon: Target, roles: ['Marketing'] },
  { to: '/sales', label: 'Sales Pipeline', icon: TrendingUp, roles: ['Marketing', 'CEO'] },
  { to: '/ai-insights', label: 'AI Insights', icon: Sparkles, roles: ['Marketing', 'CEO'] },
]

interface AppShellProps {
  user: User
  onLogout: () => void
  children: ReactNode
}

export function AppShell({ user, onLogout, children }: AppShellProps) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Recruitment Signal', detail: '3 high-quality candidates identified for Tech Lead role.', time: '2m ago', type: 'info' },
    { id: '2', title: 'System Security Alert', detail: 'New login detected from unusual location: Mumbai.', time: '15m ago', type: 'warning' },
    { id: '3', title: 'Performance Review Due', detail: 'Quarterly reviews for Engineering team start tomorrow.', time: '1h ago', type: 'success' },
  ])

  useEffect(() => {
    // Socket listener for real-time notifications
    socket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev.slice(0, 4)])
    })
    return () => { socket.off('notification') }
  }, [])

  const userRole = (user?.role || '').toUpperCase().replace(' ', '_')
  const allowed = navItems.filter((item) => {
    if (userRole === 'CEO' || userRole === 'ADMIN') return true
    return item.roles.some(r => {
      const normalizedR = r.toUpperCase().replace(' ', '_')
      return normalizedR === userRole || (normalizedR === 'LEAD' && userRole === 'TECH_LEAD')
    })
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-slate-50 p-4 transition-colors duration-300 dark:bg-slate-950 lg:p-6 overflow-hidden">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1700px] flex-col gap-4 lg:flex-row">
        <aside 
          className={`glass-panel flex flex-col overflow-hidden transition-all duration-500 dark:border-white/5 dark:bg-luxury-black/60 lg:flex-shrink-0 ${isSidebarOpen ? 'w-full lg:w-[280px]' : 'w-[80px] hidden lg:flex'}`}
        >
          <NavLink to="/dashboard" className={`border-b border-white/5 shrink-0 flex items-center transition-opacity hover:opacity-80 ${isSidebarOpen ? 'p-8' : 'p-4 justify-center'}`}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-luxury-blue text-white shadow-2xl shadow-luxury-blue/30 italic">
                <Zap className="h-6 w-6" />
              </div>
              {isSidebarOpen && (
                <div className="transition-opacity duration-300">
                  <p className="font-display text-2xl font-black tracking-tighter text-white truncate italic uppercase">Aura<span className="text-luxury-blue">HR</span></p>
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 truncate">Command Center</p>
                </div>
              )}
            </div>
          </NavLink>

          <div className={`flex-1 overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'p-6' : 'p-2'}`}>
            {isSidebarOpen ? (
              <div className="rounded-[32px] bg-gradient-to-br from-luxury-blue/20 to-transparent border border-white/5 px-6 py-6 text-white backdrop-blur-xl">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-luxury-blue">Verified Operator</p>
                <p className="mt-2 text-xl font-black truncate uppercase italic tracking-tight">{user.name}</p>
                <div className="inline-flex mt-3 items-center rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {user.role}
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4 mt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-luxury-blue text-white font-black text-lg shadow-lg shadow-luxury-blue/20">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}

            <nav className="mt-6 space-y-1">
              {allowed.map((item) => {
                const Icon = item.icon

                const isExternal = item.to.startsWith('__')
                const className = (isActive: boolean) => [
                  'group flex items-center rounded-xl font-semibold transition-all duration-200',
                  isSidebarOpen ? 'gap-3 px-4 py-2.5 text-sm' : 'justify-center p-3 text-lg mx-auto w-12 h-12',
                  isActive
                     ? 'bg-brand text-white shadow-lg shadow-brand/15'
                     : 'text-slate-600 hover:bg-slate-100 hover:text-brand dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                ].join(' ')

                if (isExternal) {
                  const token = localStorage.getItem('aurahr-token')
                  const urlWithToken =
                    item.to === '__employee__'
                      ? getModuleUrl('employee', token)
                      : item.to === '__tech__'
                        ? getModuleUrl('tech', token)
                        : getModuleUrl('helpdesk', token)

                  return (
                    <a
                      key={item.to}
                      href={urlWithToken}
                      title={!isSidebarOpen ? item.label : undefined}
                      className={className(false)}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {isSidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
                    </a>
                  )
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={!isSidebarOpen ? item.label : undefined}
                    className={({ isActive }) => className(isActive)}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {isSidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0 h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar flex flex-col pr-1 pb-1">
          <header className="glass-panel shrink-0 mb-4 flex flex-col gap-4 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Menu className="h-5 w-5" />
              </button>
              {window.location.pathname !== '/dashboard' && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider transition hover:bg-brand hover:text-white dark:bg-slate-800 dark:text-slate-400"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Back to Dashboard</span>
                </button>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-500">Live Infrastructure Linked</p>
                </div>
                {/* Search Bar */}
                <div className="relative hidden md:block group">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-luxury-blue" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search system..."
                    className="h-11 w-80 rounded-2xl border border-white/5 bg-white/5 pl-11 pr-4 text-sm font-medium text-slate-300 outline-none transition-all focus:border-luxury-blue/50 focus:bg-white/10 focus:ring-4 focus:ring-luxury-blue/5 dark:bg-slate-900/40"
                  />
                  {searchQuery && (
                    <div className="absolute top-14 left-0 right-0 glass-panel bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-4 border-white/10 shadow-2xl z-[100] rounded-2xl">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Search Results for "{searchQuery}"</p>
                       <div className="space-y-2">
                          {['Employees', 'Projects', 'Reports'].map(item => (
                            <div key={item} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl cursor-pointer group/item">
                               <span className="text-xs font-bold text-slate-300">{item} containing "{searchQuery}"</span>
                               <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Panel */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-slate-400 transition hover:bg-white/10 active:scale-95"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-luxury-blue opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-luxury-blue"></span>
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 top-14 w-80 glass-panel bg-white dark:bg-slate-950 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl z-[100] rounded-[32px] overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Recent Alerts</h4>
                        <span className="text-[10px] font-bold text-luxury-blue">{notifications.length} New</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">No new alerts</p>
                          </div>
                        ) : notifications.map(n => (
                          <div key={n.id} className="p-5 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer group">
                            <div className="flex items-start gap-4">
                                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                  n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                                  n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-luxury-blue/10 text-luxury-blue'
                                }`}>
                                  {n.type === 'warning' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-luxury-blue transition-colors">{n.title}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.detail}</p>
                                  <p className="text-[8px] text-slate-400 font-bold uppercase mt-3 tracking-widest">{n.time}</p>
                                </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-luxury-blue transition bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
                        Launch Alert Center
                    </button>
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition hover:bg-white/10 active:scale-95"
              >
                {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-400" />}
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition hover:bg-white/10 active:scale-95 overflow-hidden"
                >
                  <div className="h-full w-full bg-luxury-blue/10 flex items-center justify-center text-luxury-blue font-black text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 top-14 w-64 glass-panel bg-white dark:bg-slate-950 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl z-[100] rounded-[32px] overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-6 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-bold">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { navigate('/profile'); setIsProfileOpen(false) }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-luxury-blue hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition">Protocol Profile</button>
                      <button onClick={() => { navigate('/settings'); setIsProfileOpen(false) }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-luxury-blue hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition">Security Config</button>
                      <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-2 mx-2" />
                      <button onClick={onLogout} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 rounded-2xl transition">Terminate Session</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 min-h-0 bg-transparent">
            <div className="pb-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
