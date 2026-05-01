import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { logout } from '../../redux/slices/authSlice';
import { markAsRead, markAllAsRead, addNotification } from '../../redux/slices/notificationSlice';
import socket from '../../services/socket';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    socket.on('notification', (notification) => {
      dispatch(addNotification(notification));
    });
    return () => socket.off('notification');
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const getNotificationIcon = (type) => {
    const icons = {
      ticket_created: '🎫',
      ticket_assigned: '📋',
      ticket_updated: '✏️',
      comment_added: '💬',
      asset_assigned: '💻',
      system: '🔔'
    };
    return icons[type] || '🔔';
  };

  return (
    <header className="h-16 bg-white dark:bg-dark-100 border-b border-slate-200 dark:border-slate-800/50 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {showSearch ? (
          <motion.div initial={{ width: 200 }} animate={{ width: 300 }} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets, assets..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-dark-50 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          </motion.div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-50 border border-slate-200 dark:border-slate-700/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search...</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
        >
          {mode === 'dark' ? <Sun className="w-5 h-5 text-slate-400" /> : <Moon className="w-5 h-5 text-slate-500" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-12 w-80 bg-white dark:bg-dark-100 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={() => dispatch(markAllAsRead())} className="text-xs text-primary-500 hover:text-primary-600 font-medium">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">No notifications yet</div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <button
                        key={notif._id}
                        onClick={() => {
                          if (!notif.read) dispatch(markAsRead(notif._id));
                          if (notif.link) navigate(notif.link);
                          setShowNotifications(false);
                        }}
                        className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left ${!notif.read ? 'bg-primary-50/50 dark:bg-primary-500/5' : ''}`}
                      >
                        <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{notif.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                        </div>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" />}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-12 w-56 bg-white dark:bg-dark-100 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden py-1"
              >
                <button
                  onClick={() => { navigate('/profile'); setShowProfile(false); }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Profile</span>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-700/50 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500">Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
