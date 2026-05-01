import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './redux/slices/authSlice';
import { setTheme } from './redux/slices/themeSlice';
import { connectSocket, disconnectSocket } from './services/socket';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import Assets from './pages/Assets';
import Users from './pages/Users';
import Profile from './pages/Profile';
import { ToastContainer } from './components/ui/Toast';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || localStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = (payload.role || '').toUpperCase();
        
        if (role !== 'IT' && role !== 'ADMIN' && role !== 'CEO') {
          console.warn(`[SECURITY] Unauthorized Role: ${role}. Access Denied to IT Support Hub.`);
          window.location.href = 'http://127.0.0.1:3005/login?error=Access%20Denied';
          return;
        }
        
        localStorage.setItem('token', token);
        dispatch(getMe());
      } catch (err) {
        console.error('Invalid Protocol Token');
        window.location.href = 'http://127.0.0.1:3005/login';
      }
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (!window.location.pathname.includes('/login')) {
       window.location.href = 'http://127.0.0.1:3005/login';
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }
    return () => disconnectSocket();
  }, [user?._id]);

  if (isLoading && localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="assets" element={<Assets />} />
          <Route path="profile" element={<Profile />} />
          {user?.role === 'admin' && (
            <Route path="users" element={<Users />} />
          )}
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
