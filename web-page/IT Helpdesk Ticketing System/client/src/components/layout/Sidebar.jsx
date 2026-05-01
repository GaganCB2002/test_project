import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Ticket,
  Monitor,
  Users,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Activity
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tickets', icon: Ticket, label: 'Tickets' },
  { path: '/assets', icon: Monitor, label: 'Assets' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const adminItems = [
  { path: '/users', icon: Users, label: 'Users' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-dark-100 border-r border-slate-200 dark:border-slate-800/50 z-40 flex flex-col"
    >
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-slate-200 dark:border-slate-800/50`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">IT</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-white font-bold">IT</span>
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 dark:text-white">HelpDesk</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ticketing System</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <item.icon size={20} className={collapsed ? '' : 'shrink-0'} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className={`pt-4 pb-2 ${collapsed ? 'px-3' : 'px-3'}`}>
              {!collapsed && (
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Admin
                </p>
              )}
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={20} className={collapsed ? '' : 'shrink-0'} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800/50 space-y-2">
        <button
          onClick={() => window.location.href = 'http://127.0.0.1:3000/dashboard'}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span className="font-bold text-xs uppercase tracking-wider">HR Portal</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
