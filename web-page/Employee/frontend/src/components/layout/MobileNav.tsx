import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  CalendarCheck,
  CalendarOff,
  LifeBuoy,
  MessageSquare,
} from 'lucide-react';

const navItems = [
  { name: 'Home', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { name: 'Time', icon: Clock, path: '/time-tracking' },
  { name: 'Attendance', icon: CalendarCheck, path: '/attendance' },
  { name: 'Leave', icon: CalendarOff, path: '/leave' },
  { name: 'Tickets', icon: LifeBuoy, path: '/issues' },
  { name: 'Chat', icon: MessageSquare, path: '/chat' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 lg:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                isActive ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-950'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
