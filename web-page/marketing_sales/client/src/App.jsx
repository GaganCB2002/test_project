import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Bell, Search, Sun, Moon } from 'lucide-react';

// Lazy Load Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Leads = lazy(() => import('./pages/Leads'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const SalesPipeline = lazy(() => import('./pages/SalesPipeline'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Chat = lazy(() => import('./pages/Chat'));
const EmailGenerator = lazy(() => import('./modules/ai/EmailGenerator'));
const AIInsights = lazy(() => import('./pages/AIInsights'));
const Settings = lazy(() => import('./pages/Settings'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Authenticating...</p>
      </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    return saved === 'dark';
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              
              <main className="flex-1 ml-64 p-8 min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
                <div className="flex justify-between items-center mb-8">
                  <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search leads, campaigns, or insights..." 
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={toggleDarkMode}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                      {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
                    </button>
                    
                    <button className="p-2 relative rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                      <Bell size={20} className="text-slate-600 dark:text-slate-400" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                    </button>

                    <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                      <div className="text-right">
                        <p className="text-sm font-bold">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-slate-500">{user?.role || 'Senior Director'}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                    </div>
                  </div>
                </div>

                <Suspense fallback={<div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div></div>}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/sales" element={<SalesPipeline />} />
                    <Route path="/email" element={<EmailGenerator />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/ai-insights" element={<AIInsights />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Suspense>
                <AIAssistant />
              </main>
            </div>
          </ProtectedRoute>
        } />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
