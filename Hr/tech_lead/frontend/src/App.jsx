import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { authService } from './services/authService';
import { getRoleDestination, getRoleFromToken, normalizeRole } from './utils/roleRouting';

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
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const transferredToken = params.get('token');
      const token = transferredToken || localStorage.getItem('token');

      if (transferredToken) {
        localStorage.setItem('token', transferredToken);
        window.history.replaceState({}, '', window.location.pathname);
      }

      if (!token) {
        setBooting(false);
        return;
      }

      const tokenRole = getRoleFromToken(token);
      if (tokenRole !== 'UNKNOWN' && tokenRole !== 'TECH_LEAD') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign(getRoleDestination(tokenRole, token));
        return;
      }

      try {
        const profile = await authService.getMe();
        const role = normalizeRole(profile?.role || tokenRole);

        if (role !== 'TECH_LEAD') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.assign(getRoleDestination(role, token));
          return;
        }

        const user = {
          ...profile,
          name: profile?.name || profile?.fullName || 'Tech Lead',
          email: profile?.email || 'lead@company.com',
          role: 'TECH_LEAD',
        };

        dispatch(loginSuccess({ token, user }));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setBooting(false);
      }
    }

    bootstrapAuth();
  }, [dispatch]);

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Booting Tech Lead workspace...</p>
        </div>
      </div>
    );
  }

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
