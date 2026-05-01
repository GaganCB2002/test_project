import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from './store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Workflow from './pages/Workflow';
import Team from './pages/Team';
import Messages from './pages/Messages';
import Files from './pages/Files';
import Reports from './pages/Reports';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Overview from './pages/Overview';
import Chat from './pages/Chat';
import Emails from './pages/Emails';
import Analysis from './pages/Analysis';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || localStorage.getItem('aurahr-token');
    
    if (token) {
      // Decode JWT to verify role
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = (payload.role || '').toUpperCase();
        
        if (role !== 'TECH_LEAD' && role !== 'LEAD' && role !== 'ADMIN' && role !== 'CEO') {
          console.warn(`[SECURITY] Unauthorized Role: ${role}. Access Denied to Tech Hub.`);
          window.location.href = 'http://127.0.0.1:3005/login?error=Access%20Denied';
          return;
        }

        dispatch(loginSuccess({ 
          token, 
          user: { 
            name: payload.name || 'Tech Lead', 
            role: role,
            email: payload.email 
          } 
        }));
        localStorage.setItem('aurahr-token', token);
      } catch (err) {
        console.error('Invalid Protocol Token');
        window.location.href = 'http://127.0.0.1:3005/login';
      }
      
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else {
      window.location.href = 'http://127.0.0.1:3005/login';
    }
  }, [dispatch]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/workflow" element={<Workflow />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/emails" element={<Emails />} />
                    <Route path="/profile" element={<Settings />} /> {/* Mapping profile to settings for now */}
                    <Route path="/files" element={<Files />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/notifications" element={<Notifications />} />
                  </Routes>
                </AnimatePresence>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
