import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  CheckSquare,
  BarChart3,
  FileText,
  Users,
  Code2,
  File,
  HardDrive,
  Clock,
  Calendar,
  MessageSquare,
  Bell,
  Puzzle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Zap,
  Mail,
  User,
} from 'lucide-react';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/' },
  { icon: FolderKanban, label: 'Projects', path: '/projects' },
  { icon: GitBranch, label: 'Workflow', path: '/workflow' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: Mail, label: 'Emails', path: '/emails', badge: 2 },
  { icon: MessageSquare, label: 'Chat', path: '/chat', badge: 3 },
  { icon: Terminal, label: 'Analysis Engine', path: '/analysis' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Code2, label: 'Code Quality', path: '/code-quality' },
  { icon: File, label: 'Documents', path: '/documents' },
  { icon: HardDrive, label: 'Files', path: '/files' },
  { icon: Clock, label: 'Time Tracking', path: '/time-tracking' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Puzzle, label: 'Integrations', path: '/integrations' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? 88 : 280,
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen glass-morphism z-40 flex flex-col transition-all duration-300"
    >
      {/* Logo */}
      <div className="flex items-center h-20 px-6 border-b border-white/10 dark:border-white/5">
        <Link to="/" className="flex items-center gap-4 overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
            <Zap className="w-7 h-7 text-white fill-white/20" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-xl font-black bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent whitespace-nowrap tracking-tight">
                  TECHLEAD
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase leading-none">
                  Enterprise
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-none">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                    ${
                      active
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-500'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!sidebarCollapsed && item.badge && (
                    <span className="ml-auto bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white/20">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-white/10 dark:border-white/5 space-y-3">
        <button
          onClick={() => window.location.href = 'http://127.0.0.1:3000/dashboard'}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
        >
          <LayoutDashboard className="w-5 h-5" />
          {!sidebarCollapsed && <span className="text-sm font-bold uppercase tracking-wider">HR Portal</span>}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          {!sidebarCollapsed && <span className="text-sm font-bold uppercase tracking-wider">Logout</span>}
        </button>

        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-indigo-500 hover:text-white transition-all duration-300"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}