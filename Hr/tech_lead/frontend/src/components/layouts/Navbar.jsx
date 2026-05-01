import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Lock,
  Settings,
  Download,
  LogOut,
  X,
  Menu,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { toggleTheme } from '@/store/slices/themeSlice';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const { mode } = useSelector((state) => state.theme);
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (token && currentUser) {
      fetch('/api/location/session/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser.id || currentUser._id,
          employeeId: currentUser.employeeId || currentUser.id || currentUser._id,
          name: currentUser.name,
        }),
      }).catch(() => undefined);
    }

    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userMenuItems = [
    { icon: User, label: 'Edit Profile', path: '/profile' },
    { icon: Lock, label: 'Change Password', path: '/change-password' },
    { icon: Settings, label: 'Account Settings', path: '/account-settings' },
    { icon: Download, label: 'Download Data', path: '/download-data' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all duration-300">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left Section: Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={handleSidebarToggle}
            className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all duration-200 group"
          >
            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </button>

          <div className="hidden sm:block relative w-full max-w-md">
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search...</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Date */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 dark:bg-gray-800/50">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{currentDate}</span>
          </div>

          {/* Emails */}
          <Link
            to="/emails"
            className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all duration-200 relative group"
            title="Emails"
          >
            <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900" />
          </Link>

          {/* Chat */}
          <Link
            to="/chat"
            className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all duration-200 group"
            title="Chat"
          >
            <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </Link>

          {/* Profile Quick Link */}
          <Link
            to="/profile"
            className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all duration-200 group"
            title="Profile"
          >
            <User className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all duration-200"
          >
            <AnimatePresence mode="wait">
              {mode === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-4 w-80 glass-morphism rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-5 py-4 border-b border-white/10 dark:border-white/5">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-8 text-center">
                        <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No new notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif._id}
                          className="px-5 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 border-b border-white/10 dark:border-white/5 transition-colors cursor-pointer"
                        >
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {notif.message || notif.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(notif.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-[1px] bg-white/20 dark:bg-white/10 mx-1" />

            {/* Profile Section with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(user?.name)}
                  </div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">
                    {user?.role || 'Member'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-4 w-64 glass-morphism rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                  >
                    <div className="px-4 py-3 mb-2 border-b border-white/10">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-500 rounded-xl transition-all"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="h-[1px] bg-white/10 my-2 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
