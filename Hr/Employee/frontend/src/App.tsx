import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import TaskDetail from '@/pages/TaskDetail';
import TimeTracking from '@/pages/TimeTracking';
import AttendancePage from '@/pages/Attendance';
import LeavePage from '@/pages/Leave';
import IssuesPage from '@/pages/Issues';
import SubmissionsPage from '@/pages/Submissions';
import FilesPage from '@/pages/Files';
import ChatPage from '@/pages/Chat';
import NotificationsPage from '@/pages/Notifications';
import PerformancePage from '@/pages/Performance';
import LoginPage from '@/pages/Login';
import PeoplePage from '@/pages/People';
import { useTracking } from '@/hooks/useTracking';

function ProtectedLayout() {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  useTracking(user, token);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-500 shadow-sm">
          Loading your workspace...
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute />} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/employee" element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="time-tracking" element={<TimeTracking />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave" element={<LeavePage />} />
        <Route path="issues" element={<IssuesPage />} />
        <Route path="submissions" element={<SubmissionsPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="people" element={<PeoplePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
