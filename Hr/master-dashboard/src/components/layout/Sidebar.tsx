import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  ChevronRight,
  KeyRound,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import type { NavSectionId, NavigationItem } from '../../types'

interface SidebarProps {
  items: NavigationItem[]
  activeSection: NavSectionId
  onSelect: (section: NavSectionId) => void
}

const iconMap: Record<NavSectionId, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  workspaces: Briefcase,
  projects: Briefcase,
  employees: Users,
  'hr-management': Users,
  'task-management': Briefcase,
  attendance: Activity,
  payroll: Receipt,
  'revenue-analytics': BarChart3,
  'performance-metrics': Activity,
  'project-insights': LineChart,
  'roi-dashboard': Wallet,
  messages: MessageSquare,
  channels: Bell,
  notifications: Bell,
  'ai-assistant': Bot,
  predictions: Sparkles,
  'automation-center': Sparkles,
  settings: Settings,
  'user-roles': KeyRound,
  logs: ScrollText,
  security: ShieldCheck,
}

export function Sidebar({ items, activeSection, onSelect }: SidebarProps) {
  const groups = Array.from(new Set(items.map((item) => item.group)))

  return (
    <aside className="hidden w-[300px] shrink-0 border-r border-slate-200/70 bg-white/72 px-5 py-6 backdrop-blur xl:flex xl:flex-col dark:border-white/8 dark:bg-slate-950/70">
      <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 px-5 py-5 text-white dark:border-white/8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg font-semibold">
            OS
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">Company Operating System</p>
            <p className="text-xs text-white/60">CEO + Administrator control plane</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {groups.map((group) => (
          <div key={group} className="mb-6">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">{group}</p>
            <div className="space-y-1.5">
              {items
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = iconMap[item.id]
                  const selected = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={`group flex w-full items-start gap-3 rounded-[22px] px-3 py-3 text-left transition ${
                        selected
                          ? 'bg-slate-950 text-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[0.04] dark:hover:text-white'
                      }`}
                    >
                      <span className={`mt-0.5 rounded-2xl p-2 ${selected ? 'bg-white/10' : 'bg-slate-100 dark:bg-white/[0.04]'}`}>
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className={`mt-1 block text-xs leading-5 ${selected ? 'text-white/65' : 'text-slate-500 dark:text-slate-400'}`}>{item.description}</span>
                      </span>
                      <ChevronRight size={16} className={`mt-1 transition ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
