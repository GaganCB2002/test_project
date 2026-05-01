import React, { startTransition, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { api } from './api/client'
import { socket } from './api/socket'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { LandingPage } from './pages/LandingPage'
import { ProductPage } from './pages/Product/ProductPage'
import { FeaturesPage } from './pages/Features/FeaturesPage'
import { SolutionsPage } from './pages/Solutions/SolutionsPage'
import { ResourcesPage } from './pages/Resources/ResourcesPage'
import { PrivacyPage } from './pages/Legal/PrivacyPage'
import { TermsPage } from './pages/Legal/TermsPage'
import { SecurityPage } from './pages/Legal/SecurityPage'
import { CollaborationDetails } from './pages/Features/Sections/CollaborationDetails'
import { PerformanceDetails } from './pages/Features/Sections/PerformanceDetails'
import { EnterpriseHRDetails } from './pages/Features/Sections/EnterpriseHRDetails'
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
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import TechLeadDashboard from './pages/TechLeadDashboard'
import { MarketingDashboard, SalesPipeline, AIInsights } from './pages/MarketingPages'
import AnalysisModule from './pages/AnalysisModule'
import { ManagerDashboardPage } from './pages/ManagerDashboardPage'
import { CEODashboardPage } from './pages/CEODashboardPage'
import { TeamLeadDashboardPage } from './pages/TeamLeadDashboardPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { ContactProvider } from './components/layout/ContactContext'

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
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const refreshPlatform = async (sessionToken = token) => {
    if (!sessionToken) return null
    try {
      const [me, snapshot] = await Promise.all([api.getMe(sessionToken), api.getPlatform(sessionToken)])
      startTransition(() => {
        setUser(me)
        setPlatform(snapshot)
        setFeed(snapshot.activity.slice(0, 15))
      })
      return me
    } catch (err) {
      console.error("Platform Refresh Error:", err)
      return null
    }
  }

  useEffect(() => {
    if (!token) {
      setBooting(false)
      return
    }
    refreshPlatform(token).then(u => {
      if (!u) {
        // If token is invalid, clear it to allow landing page access
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      }
    }).finally(() => setBooting(false))
  }, [token])

  const handleLogin = async (email: string, pass: string, _role?: string) => {
    try {
      setError(null)
      const { token: newToken, user: userData, redirectUrl } = await api.login(email, pass)
      localStorage.setItem(TOKEN_KEY, newToken)
      setToken(newToken)
      setUser(userData)
      
      const snapshot = await api.getPlatform(newToken)
      setPlatform(snapshot)
      setFeed(snapshot.activity.slice(0, 15))
      
      console.log(`[AUTH] Navigating to: ${redirectUrl || '/'}`);
      navigate(redirectUrl || '/')
    } catch (loginError: any) {
      console.error("[AUTH] Login Error:", loginError);
      setError(loginError.message || 'Invalid credentials or server offline.')
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setPlatform(null)
    setFeed([])
    socket.disconnect()
    navigate('/')
  }

  const roleRedirection = useMemo(() => {
    if (!user) return null
    const role = user.role.toUpperCase()
    if (role === 'ADMIN' || role === 'SUPERADMIN') return '/admin-dashboard'
    if (role === 'CEO') return '/ceo-dashboard'
    if (role === 'MANAGER') return '/manager-dashboard'
    if (role === 'HR') return '/hr-dashboard'
    if (role === 'EMPLOYEE') return '/employee-dashboard'
    if (role === 'LEAD' || role === 'TECH_LEAD') return '/techlead-dashboard'
    if (role === 'MARKETING') return '/marketing-hub'
    return '/hr-dashboard'
  }, [user])

  if (booting) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-luxury-blue border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-500 italic">Initializing AuraHR Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <ContactProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} error={error} />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/" element={(token && roleRedirection) ? <Navigate to={roleRedirection} replace /> : <LandingPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/*" element={
          <ProtectedRoute user={user} allowedRoles={['CEO', 'HR', 'MANAGER', 'LEAD', 'TECH_LEAD', 'EMPLOYEE', 'MARKETING', 'ADMIN', 'SUPERADMIN']}>
            {user && platform ? (
              <AppShell user={user} onLogout={logout}>
                <Routes>
                  <Route path="admin-dashboard" element={<AdminDashboardPage user={user} platform={platform} />} />
                  <Route path="ceo-dashboard" element={<CEODashboardPage user={user} platform={platform} />} />
                  <Route path="manager-dashboard" element={<ManagerDashboardPage user={user} platform={platform} />} />
                  <Route path="hr-dashboard" element={<DashboardPage data={platform.dashboard} feed={feed} onRefresh={() => refreshPlatform()} />} />
                  <Route path="employee-dashboard" element={<EmployeeDashboardPage user={user} platform={platform} token={token} />} />
                  <Route path="techlead-dashboard" element={<TechLeadDashboard user={user} platform={platform} />} />
                  <Route path="teamlead-dashboard" element={<TeamLeadDashboardPage user={user} platform={platform} />} />
                  
                  <Route path="feed" element={<ActivityFeedPage feed={feed} />} />
                  <Route path="recruitment" element={<RecruitmentPage platform={platform} token={token} role={user.role} onRefresh={() => refreshPlatform()} />} />
                  <Route path="allocation" element={<AllocationPage platform={platform} token={token} onRefresh={() => refreshPlatform()} />} />
                  <Route path="leave-approvals" element={<HumanResourcesPage />} />
                  <Route path="payroll" element={<PayrollPage platform={platform} token={token} onRefresh={() => refreshPlatform()} />} />
                  <Route path="budget" element={<BudgetPage platform={platform} />} />
                  <Route path="exit" element={<ExitPage platform={platform} />} />
                  <Route path="profile" element={<ProfilePage user={user} token={token} onUpdate={(u) => setUser(u)} />} />
                  <Route path="onboarding" element={<OnboardingPage platform={platform} />} />
                  <Route path="documentation" element={<DocumentationPage platform={platform} />} />
                  <Route path="people" element={<PeoplePage platform={platform} token={token} />} />
                  <Route path="chat" element={<ChatPage user={user} token={token} />} />
                  <Route path="mail" element={<MailPage user={user} token={token} />} />
                  <Route path="attendance" element={<HumanResourcesPage />} />
                  <Route path="performance" element={<PerformancePage platform={platform} />} />
                  <Route path="projects" element={<ProjectManagementPage />} />
                  <Route path="engagement" element={<EngagementPage platform={platform} />} />
                  <Route path="compliance" element={<CompliancePage platform={platform} />} />
                  <Route path="analytics" element={<AnalyticsPage platform={platform} />} />
                  <Route path="live-tracking" element={<LiveTrackingPage token={token} />} />
                  <Route path="help-desk" element={<HelpDeskPage platform={platform} token={token} />} />
                  <Route path="meetings" element={<MeetingRoom />} />
                  <Route path="analysis-sync" element={<AnalysisModule />} />
                  
                  <Route path="marketing-hub" element={<MarketingDashboard />} />
                  <Route path="sales" element={<SalesPipeline />} />
                  <Route path="ai-insights" element={<AIInsights />} />
                  
                  <Route path="*" element={<Navigate to={roleRedirection} replace />} />
                </Routes>
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )}
          </ProtectedRoute>
        } />
      </Routes>
    </ContactProvider>
  )
}

export default App
