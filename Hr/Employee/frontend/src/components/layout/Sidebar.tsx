import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  CalendarCheck,
  CalendarOff,
  LifeBuoy,
  FileText,
  MessageSquare,
  Bell,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'My Tasks', icon: CheckSquare, path: '/tasks' },
  { name: 'Time Tracking', icon: Clock, path: '/time-tracking' },
  { name: 'Attendance', icon: CalendarCheck, path: '/attendance' },
  { name: 'Leave', icon: CalendarOff, path: '/leave' },
  { name: 'Tickets', icon: LifeBuoy, path: '/issues' },
  { name: 'Files', icon: FileText, path: '/files' },
  { name: 'Chat', icon: MessageSquare, path: '/chat' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Performance', icon: BarChart3, path: '/performance' },
  { name: 'People', icon: Users, path: '/people' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const availableNavItems = navItems.filter((item) => item.path !== '/people' || user?.role === 'ADMIN' || user?.role === 'HR');

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40 flex flex-col shadow-sm',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-sky-600 flex items-center justify-center font-bold text-white shadow-sm">
            XYZ
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg text-slate-950">Employee Hub</span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-dark">
        <ul className="space-y-1">
          {availableNavItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-teal-50 text-teal-700 border border-teal-100'
                      : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

        <div className={cn('flex flex-col gap-2 p-3', isCollapsed && 'items-center')}>
          <button
            onClick={() => window.location.href = 'http://127.0.0.1:3000/dashboard'}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full bg-teal-500/10 text-teal-700 hover:bg-teal-500 hover:text-white",
              isCollapsed && "justify-center"
            )}
            title="Return to HR Portal"
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-bold text-xs uppercase tracking-wider">HR Portal</span>}
          </button>
          
          <div className={cn('flex items-center gap-3 mt-2', isCollapsed && 'justify-center')}>
            <Avatar
              src={user?.avatar}
              firstName={user?.first_name || 'U'}
              lastName={user?.last_name || 'U'}
              size="md"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-950 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.designation}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-950 shadow-sm transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
