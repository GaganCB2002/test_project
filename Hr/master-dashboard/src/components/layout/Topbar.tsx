import { Bell, ChevronDown, Command, MoonStar, Plus, Search, SunMedium } from 'lucide-react'
import type { WorkspaceOption } from '../../types'

interface TopbarProps {
  workspaceId: string
  workspaces: WorkspaceOption[]
  userName: string
  userRole: string
  userInitials: string
  onWorkspaceChange: (workspaceId: string) => void
  onOpenCommand: () => void
  onQuickProject: () => void
  onQuickWorkspace: () => void
  onOpenNotifications: () => void
  onToggleTheme: () => void
  isDark: boolean
}

export function Topbar({
  workspaceId,
  workspaces,
  userName,
  userRole,
  userInitials,
  onWorkspaceChange,
  onOpenCommand,
  onQuickProject,
  onQuickWorkspace,
  onOpenNotifications,
  onToggleTheme,
  isDark,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[color:var(--shell-bg)]/85 px-4 py-4 backdrop-blur md:px-6 xl:px-8 dark:border-white/8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenCommand}
            className="flex min-w-0 flex-1 items-center justify-between rounded-[22px] border border-slate-200/80 bg-white/85 px-4 py-3 text-left text-sm text-slate-500 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition hover:border-slate-300 hover:text-slate-900 dark:border-white/8 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-white"
          >
            <span className="inline-flex min-w-0 items-center gap-3">
              <Search size={16} />
              <span className="truncate">Search dashboards, projects, employees, actions</span>
            </span>
            <span className="ml-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs dark:border-white/10 dark:bg-white/[0.04]">
              <Command size={12} />
              Ctrl + K
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-[18px] border border-slate-200/80 bg-white/85 px-3 py-3 text-sm shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-white/8 dark:bg-white/[0.03]">
            <span className="text-slate-500 dark:text-slate-400">Workspace</span>
            <select
              value={workspaceId}
              onChange={(event) => onWorkspaceChange(event.target.value)}
              className="bg-transparent font-semibold text-slate-900 outline-none dark:text-white"
            >
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="text-slate-400" />
          </label>

          <button
            type="button"
            onClick={onQuickProject}
            className="inline-flex items-center gap-2 rounded-[18px] border border-slate-200/80 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition hover:border-slate-300 dark:border-white/8 dark:bg-white/[0.03] dark:text-white"
          >
            <Plus size={16} />
            Create Project
          </button>

          <button
            type="button"
            onClick={onQuickWorkspace}
            className="inline-flex items-center gap-2 rounded-[18px] bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
          >
            <Plus size={16} />
            Create Workspace
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative rounded-[18px] border border-slate-200/80 bg-white/85 p-3 text-slate-700 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition hover:border-slate-300 dark:border-white/8 dark:bg-white/[0.03] dark:text-slate-200"
            aria-label="Open notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-[18px] border border-slate-200/80 bg-white/85 p-3 text-slate-700 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition hover:border-slate-300 dark:border-white/8 dark:bg-white/[0.03] dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>

          <div className="inline-flex items-center gap-3 rounded-[22px] border border-slate-200/80 bg-white/90 px-3 py-2.5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-white/8 dark:bg-white/[0.03]">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{userName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{userRole}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-semibold text-white">
              {userInitials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
