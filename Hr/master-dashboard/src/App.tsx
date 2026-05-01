import { useEffect, useMemo, useState } from 'react'
import { CommandPalette } from './components/layout/CommandPalette'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { OverviewPage } from './components/dashboard/OverviewPage'
import { SectionPage } from './components/dashboard/SectionPage'
import { MetricDetailModal } from './components/ui/MetricDetailModal'
import { dashboardData, navigationItems } from './data/dashboard'
import type { DashboardMetric, NavSectionId, ThemeMode, TimelineEvent } from './types'
import { decodeSessionIdentity, getRoleDestination } from './lib/auth'

const THEME_KEY = 'company-os-theme'
const TOKEN_KEY = 'aurahr-token'

function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem(THEME_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'dark'
  })
  const [activeSection, setActiveSection] = useState<NavSectionId>('overview')
  const [workspaceId, setWorkspaceId] = useState(dashboardData.workspaces[0]?.id ?? '')
  const [commandOpen, setCommandOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<DashboardMetric | null>(null)
  const [activity, setActivity] = useState<TimelineEvent[]>(dashboardData.activity)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [viewerName, setViewerName] = useState(dashboardData.user.name)
  const [viewerRole, setViewerRole] = useState(dashboardData.user.role)
  const [viewerInitials, setViewerInitials] = useState(dashboardData.user.initials)

  const activeBlueprint = useMemo(
    () => dashboardData.sections.find((section) => section.id === activeSection) ?? dashboardData.sections[0],
    [activeSection],
  )

  const dataset = useMemo(
    () => ({
      ...dashboardData,
      user: {
        ...dashboardData.user,
        name: viewerName,
        role: viewerRole,
        initials: viewerInitials,
      },
    }),
    [viewerInitials, viewerName, viewerRole],
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const transferredToken = params.get('token')
    const token = transferredToken || window.localStorage.getItem(TOKEN_KEY)

    if (transferredToken) {
      window.localStorage.setItem(TOKEN_KEY, transferredToken)
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    if (!token) {
      window.location.assign('http://127.0.0.1:3005/login')
      return
    }

    const identity = decodeSessionIdentity(token)
    if (!identity) {
      window.localStorage.removeItem(TOKEN_KEY)
      window.location.assign('http://127.0.0.1:3005/login')
      return
    }

    if (identity.role !== 'CEO' && identity.role !== 'ADMIN') {
      window.location.assign(getRoleDestination(identity.role, token))
      return
    }

    const nameParts = identity.name
      .split(' ')
      .map((part) => part.trim())
      .filter(Boolean)

    setViewerName(identity.name)
    setViewerRole(identity.role === 'ADMIN' ? 'Admin / System Control' : 'CEO / System Admin')
    setViewerInitials(nameParts.slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'AO')
    setIsAuthorized(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }

      if (event.key === 'Escape') {
        setCommandOpen(false)
        setSelectedMetric(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function pushActivityEntry(title: string, detail: string, type: TimelineEvent['type']) {
    setActivity((current) => [
      {
        id: `event-${Date.now()}`,
        title,
        detail,
        actor: viewerName,
        timestamp: 'Just now',
        type,
      },
      ...current.slice(0, 5),
    ])
  }

  function openSection(section: NavSectionId) {
    setActiveSection(section)
    setCommandOpen(false)
  }

  function handleWorkspaceChange(nextWorkspaceId: string) {
    setWorkspaceId(nextWorkspaceId)
    const workspace = dashboardData.workspaces.find((item) => item.id === nextWorkspaceId)
    if (workspace) {
      pushActivityEntry(
        `Workspace context switched to ${workspace.name}`,
        `Previewing ${workspace.region} operating data owned by ${workspace.owner}.`,
        'System',
      )
    }
  }

  const currentWorkspace = dashboardData.workspaces.find((workspace) => workspace.id === workspaceId)

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[color:var(--shell-bg)] text-slate-950 transition-colors duration-300 dark:text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-white/20 dark:border-t-white" />
            <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Authorizing CEO control panel...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[color:var(--shell-bg)] text-slate-950 transition-colors duration-300 dark:text-white">
      <div className="shell-glow shell-glow-left" />
      <div className="shell-glow shell-glow-right" />

      <div className="relative flex min-h-screen">
        <Sidebar items={navigationItems} activeSection={activeSection} onSelect={openSection} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            workspaceId={workspaceId}
            workspaces={dataset.workspaces}
            userName={dataset.user.name}
            userRole={dataset.user.role}
            userInitials={dataset.user.initials}
            onWorkspaceChange={handleWorkspaceChange}
            onOpenCommand={() => setCommandOpen(true)}
            onQuickProject={() => {
              openSection('projects')
              pushActivityEntry('Quick action: Create Project', 'Project creation flow is staged from the top navigation.', 'Project')
            }}
            onQuickWorkspace={() => {
              openSection('workspaces')
              pushActivityEntry('Quick action: Create Workspace', 'Workspace creation flow is staged from the top navigation.', 'System')
            }}
            onOpenNotifications={() => openSection('notifications')}
            onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            isDark={theme === 'dark'}
          />

          <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 xl:px-8 custom-scrollbar">
            <div className="mx-auto max-w-[1680px] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200/70 bg-white/72 px-4 py-3 text-sm text-slate-600 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-white/8 dark:bg-white/[0.03] dark:text-slate-300">
                <span>
                  Viewing <strong className="text-slate-950 dark:text-white">{currentWorkspace?.name}</strong> with a Step 1 UI scaffold ready for live service integration.
                </span>
                <button
                  type="button"
                  onClick={() => openSection('security')}
                  className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:bg-white dark:text-slate-950"
                >
                  Integration readiness
                </button>
              </div>

              {activeSection === 'overview' ? (
                <OverviewPage
                  data={{ ...dataset, activity }}
                  onOpenMetric={setSelectedMetric}
                  onSelectSection={openSection}
                />
              ) : (
                <SectionPage
                  section={activeBlueprint}
                  data={{ ...dataset, activity }}
                  onOpenAiAssistant={() => openSection('ai-assistant')}
                  onOpenNotifications={() => openSection('notifications')}
                  onSelectSection={openSection}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <CommandPalette open={commandOpen} items={navigationItems} onClose={() => setCommandOpen(false)} onSelect={openSection} />
      <MetricDetailModal metric={selectedMetric} onClose={() => setSelectedMetric(null)} />
    </div>
  )
}

export default App
