import { useEffect, useState } from 'react'
import { api } from '../../frontend/src/api/client' // Reuse the same API client
import { ProtectedRoute } from '../../frontend/src/components/auth/ProtectedRoute'
import { DashboardPage } from '../../frontend/src/pages/DashboardPage'
import type { User, PlatformData } from '../../frontend/src/types'

const TOKEN_KEY = 'aurahr-token'

function App() {
  const [token, setToken] = useState<string | null>(() => {
    // Check URL first (passed from main app)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem(TOKEN_KEY, urlToken)
      window.history.replaceState({}, document.title, window.location.pathname)
      return urlToken
    }
    return localStorage.getItem(TOKEN_KEY)
  })

  const [user, setUser] = useState<User | null>(null)
  const [platform, setPlatform] = useState<PlatformData | null>(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    if (!token) {
      setBooting(false)
      return
    }

    const init = async () => {
      try {
        const [me, snapshot] = await Promise.all([
          api.getMe(token),
          api.getPlatform(token)
        ])
        setUser(me)
        setPlatform(snapshot)
      } catch (err) {
        console.error('HR Dashboard Auth Error:', err)
        // If auth fails on 3001, go back to 3000 login
        window.location.href = 'http://localhost:3005/login'
      } finally {
        setBooting(false)
      }
    }

    init()
  }, [token])

  if (!token) {
    window.location.href = 'http://localhost:3005/login'
    return null
  }

  if (booting) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020617]">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">Initializing Secure HR Environment...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute user={user} allowedRoles={['HR', 'CEO', 'ADMIN']}>
      {platform && (
        <div className="min-h-screen bg-[#020617] text-white">
          <header className="p-6 border-b border-white/5 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold tracking-tight">HR Operations Console</h1>
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Secure Port 3001 Access</p>
            </div>
            <button 
              onClick={() => window.location.href = 'http://localhost:3005/dashboard'}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition"
            >
              Back to Main Hub
            </button>
          </header>
          <main className="p-8">
            {/* The HR Dashboard Content */}
            <div className="glass-panel p-8 rounded-[32px] bg-white/5 border-white/5">
               <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
               <p className="text-slate-400 mb-8">This is the dedicated HR Operations environment running on its own secure port.</p>
               <div className="grid md:grid-cols-3 gap-6">
                 {['Recruitment', 'Payroll', 'Employee Lifecycle'].map(task => (
                   <div key={task} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-purple-500/10 transition cursor-pointer">
                     <p className="font-bold text-sm">{task}</p>
                     <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">Manage Module</p>
                   </div>
                 ))}
               </div>
            </div>
          </main>
        </div>
      )}
    </ProtectedRoute>
  )
}

export default App
