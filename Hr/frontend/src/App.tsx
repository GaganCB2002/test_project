import { startTransition, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { api } from './api/client'
import { socket } from './api/socket'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { LandingPage } from './pages/LandingPage'
import { ProductPage } from './pages/marketing/ProductPage'
import { FeaturesPage } from './pages/marketing/FeaturesPage'
import { SolutionsPage } from './pages/marketing/SolutionsPage'
import { PricingPage } from './pages/marketing/PricingPage'
import { ResourcesPage } from './pages/marketing/ResourcesPage'
import {
  AnalyticsPage,
  AttendancePage,
  BudgetPage,
  CompliancePage,
  EngagementPage,
  ExitPage,
  OnboardingPage,
  PayrollPage,
  PeoplePage,
  PerformancePage,
  ProjectsPage,
  RecruitmentPage,
  HelpDeskPage,
  LiveTrackingPage,
} from './pages/ModulePages'
import { AllocationPage } from './pages/AllocationPage'
import { ChatPage } from './pages/ChatPage'
import { ActivityFeedPage } from './pages/ActivityFeedPage'
import { MailPage } from './pages/MailPage'
import { ProfilePage } from './pages/ProfilePage'
import { DocumentationPage } from './pages/DocumentationPage'
import { LeaveManagementPage } from './pages/LeaveManagementPage'
import { EmployeeDashboardPage } from './pages/EmployeeDashboardPage'
import { ProjectManagementPage } from './pages/ProjectManagementPage'
import { HumanResourcesPage } from './pages/HumanResourcesPage'
import { MeetingRoom } from './pages/MeetingRoom'
import { useTracking } from './hooks/useTracking'
import type { ActivityItem, PlatformData, User } from './types'
import { MasterDashboardPage } from './pages/MasterDashboardPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import TechLeadDashboard from './pages/TechLeadDashboard'
import { MarketingDashboard, SalesPipeline, AIInsights } from './pages/MarketingPages'
import AnalysisModule from './pages/AnalysisModule'
import { canAccessSelectedRole, getRoleDestination, isGenericEntryRoute, normalizeRole } from './lib/roleRouting'
import { SecurityProvider } from './context/SecurityContext'

const TOKEN_KEY = 'aurahr-token'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  
  // Start global GPS tracking
  useTracking(user, token)
  const [platform, setPlatform] = useState<PlatformData | null>(null)
  const [feed, setFeed] = useState<ActivityItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    // Check for token in URL (Transfer from Employee/Tech Lead hub)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem(TOKEN_KEY, urlToken)
      setToken(urlToken)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const refreshPlatform = useCallback(async (sessionToken = token) => {
    if (!sessionToken) return null

    try {
      const [me, snapshot] = await Promise.all([api.getMe(sessionToken), api.getPlatform(sessionToken)])

      startTransition(() => {
        setUser(me)
        setPlatform(snapshot)
        setFeed(snapshot.activity.slice(0, 15))
        setError(null) // Clear any previous errors on success
      })
      return me
    } catch (err: any) {
      console.error('[REFRESH] Failure:', err)
      throw err
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      setBooting(false)
      socket.disconnect()
      return
    }

    // Prevent infinite retry loop on error
    if (error && !booting) return;

    setBooting(true)
    socket.connect()
    
    refreshPlatform(token)
      .then((me) => {
        if (!me) return

        const destination = getRoleDestination(me.role, token)

        if (destination.kind === 'external') {
          window.location.assign(destination.url)
          return
        }

        if (isGenericEntryRoute(location.pathname) && location.pathname !== destination.path) {
          navigate(destination.path, { replace: true })
        }
      })
      .catch((err) => {
        console.error('Booting Error:', err)
        setError(`System Initialization Failed: ${err.message || 'Check Server Connectivity'}`)
      })
      .finally(() => setBooting(false))
      
    // Socket listener for global activities
    const onNewActivity = (item: ActivityItem) => {
      setFeed((current) => [item, ...current].slice(0, 15))
    }
    
    socket.on('new_activity', onNewActivity)
    return () => {
      socket.off('new_activity', onNewActivity)
    }
  }, [location.pathname, navigate, token, error, booting, refreshPlatform])

  const login = useCallback(async (email: string, password: string, selectedRole: string) => {
    setError(null)
    try {
      const session = await api.login(email, password)

      const actualRole = normalizeRole(session?.role || session?.user?.role)
      const requestedRole = normalizeRole(selectedRole)

      console.log(`[AUTH] Login Success. Actual: ${actualRole}, Requested: ${requestedRole}`)

      if (!canAccessSelectedRole(actualRole, requestedRole)) {
        throw new Error(`Role Mismatch: This account is registered as ${session?.role || 'Unknown'}, not ${selectedRole}.`)
      }

      localStorage.setItem(TOKEN_KEY, session.token)
      localStorage.setItem('aurahr-role', actualRole)
      setToken(session.token)

      const destination = getRoleDestination(actualRole, session.token)
      if (destination.kind === 'external') {
        window.location.assign(destination.url)
        return
      }

      navigate(destination.path, { replace: true })
    } catch (loginError: any) {
      console.error('[AUTH] Login Error:', loginError)
      setError(loginError.message || 'Invalid credentials or role mismatch.')
      throw loginError
    }
  }, [navigate])

  const logout = useCallback(() => {
    if (user && token) {
      fetch('/api/location/session/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          employeeId: user.employeeId || user.id,
          name: user.name,
        }),
      }).catch((err) => {
        console.error('Failed to stop tracking session:', err)
      })
    }

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('aurahr-role')
    setToken(null)
    setUser(null)
    setPlatform(null)
    setFeed([])
    socket.disconnect()
    navigate('/')
  }, [navigate, token, user])

  const routes = useMemo(() => {
    if (!user || !platform || !token) return null

    return (
      <Routes>
        <Route path="/dashboard" element={<MasterDashboardPage user={user} onLogout={logout} />} />
        
        <Route path="/hr-dashboard" element={
          <ProtectedRoute user={user} allowedRoles={['HR', 'CEO', 'ADMIN']}>
            {!platform ? (
              <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                 <div className="text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-luxury-blue border-t-transparent mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-slate-500">Initializing HR Dashboard...</p>
                 </div>
              </div>
            ) : (
              <DashboardPage data={platform.dashboard} feed={feed} onRefresh={async () => { await refreshPlatform() }} />
            )}
          </ProtectedRoute>
        } />

        <Route path="/employee-dashboard" element={
          <ProtectedRoute user={user} allowedRoles={['Employee']}>
            <EmployeeDashboardPage platform={platform} user={user} token={token} />
          </ProtectedRoute>
        } />

        <Route path="/manager-dashboard" element={
          <ProtectedRoute user={user} allowedRoles={['Manager', 'CEO', 'ADMIN']}>
            <MasterDashboardPage user={user} onLogout={logout} />
          </ProtectedRoute>
        } />

        <Route path="/techlead-dashboard" element={
          <ProtectedRoute user={user} allowedRoles={['TECH_LEAD', 'Lead']}>
            <TechLeadDashboard user={user} />
          </ProtectedRoute>
        } />
        <Route path="/marketing-hub" element={<MarketingDashboard />} />
        
        <Route path="/sales" element={<ProtectedRoute user={user} allowedRoles={['Marketing', 'CEO']}><SalesPipeline /></ProtectedRoute>} />
        <Route path="/ai-insights" element={<ProtectedRoute user={user} allowedRoles={['Marketing', 'CEO']}><AIInsights /></ProtectedRoute>} />

        <Route path="/feed" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'TECH_LEAD']}><ActivityFeedPage feed={feed} /></ProtectedRoute>} />
        <Route path="/recruitment" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'TECH_LEAD']}><RecruitmentPage platform={platform} token={token} role={user.role} onRefresh={async () => { await refreshPlatform() }} /></ProtectedRoute>} />
        <Route path="/allocation" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'TECH_LEAD']}><AllocationPage platform={platform} token={token} onRefresh={async () => { await refreshPlatform() }} /></ProtectedRoute>} />
        <Route path="/leave-approvals" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'TECH_LEAD']}><HumanResourcesPage /></ProtectedRoute>} />
        <Route path="/payroll" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager']}><PayrollPage platform={platform} token={token} onRefresh={async () => { await refreshPlatform() }} /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR']}><BudgetPage platform={platform} /></ProtectedRoute>} />
        <Route path="/exit" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager']}><ExitPage platform={platform} /></ProtectedRoute>} />
        
        <Route path="/profile" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD', 'Marketing']}><ProfilePage user={user} token={token} onUpdate={(updated) => setUser(updated)} /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD']}><OnboardingPage platform={platform} /></ProtectedRoute>} />
        <Route path="/documentation" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD', 'Marketing']}><DocumentationPage platform={platform} /></ProtectedRoute>} />
        <Route path="/people" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD']}><PeoplePage platform={platform} token={token} /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD', 'Marketing']}><ChatPage user={user} token={token} /></ProtectedRoute>} />
        <Route path="/mail" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD', 'Marketing']}><MailPage user={user} token={token} /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD']}><HumanResourcesPage /></ProtectedRoute>} />
        <Route path="/performance" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD']}><PerformancePage platform={platform} /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD', 'Marketing']}><ProjectManagementPage /></ProtectedRoute>} />
        <Route path="/engagement" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD']}><EngagementPage platform={platform} /></ProtectedRoute>} />
        <Route path="/compliance" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD']}><CompliancePage platform={platform} /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'Manager', 'Lead', 'Employee', 'TECH_LEAD']}><AnalyticsPage platform={platform} /></ProtectedRoute>} />
      </Routes>
    )
  }, [feed, platform, refreshPlatform, token, user, logout])

  return (
    <SecurityProvider onLogout={logout}>
      <Routes>
        {/* Marketing Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/resources" element={<ResourcesPage />} />

        {/* Login Page */}
        <Route 
          path="/login" 
          element={
            !token ? (
              <LoginPage onLogin={login} error={error} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />

        {/* Protected App Routes */}
        <Route 
          path="*" 
          element={
            !token ? (
              <Navigate to="/login" replace />
            ) : booting || !user || !platform || !routes ? (
              <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center max-w-md p-8">
                  {error ? (
                    <div className="glass-panel border-rose-200 bg-rose-50/50 p-6 rounded-[24px]">
                      <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold">!</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 mb-2">System Error</h3>
                      <p className="text-sm text-slate-600 mb-6">{error}</p>
                      <button 
                        onClick={logout}
                        className="w-full py-3 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-brand transition"
                      >
                        Return to Login
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-luxury-blue border-t-transparent shadow-lg shadow-luxury-blue/20"></div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">Establishing Secure Connection...</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <AppShell user={user} onLogout={logout}>
                {routes}
              </AppShell>
            )
          } 
        />
      </Routes>
    </SecurityProvider>
  )
}

export default App
