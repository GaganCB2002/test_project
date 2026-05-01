import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bell,
  MessageSquare,
  File,
  AlertCircle,
  Check,
  Trash2,
  CheckCheck,
  Filter,
  Loader2,
} from 'lucide-react';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  addNotification,
} from '../store/slices/notificationSlice';

const filterTabs = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'tasks', label: 'Tasks', icon: Check },
  { id: 'messages', label: 'MessageSquare', icon: MessageSquare },
  { id: 'files', label: 'Files', icon: File },
  { id: 'system', label: 'System', icon: AlertCircle },
];

// Mock initial notifications
const mockNotifications = [
  {
    _id: '1',
    type: 'tasks',
    title: 'Task completed',
    message: 'Sarah Chen completed "Review API documentation"',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    type: 'messages',
    title: 'New message',
    message: 'Mike Johnson sent you a message about the project deadline',
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    type: 'files',
    title: 'File uploaded',
    message: 'Emily Davis uploaded "Q1_Report_Final.pdf" to the project',
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    type: 'system',
    title: 'System update',
    message: 'The system will undergo maintenance on April 30th at 2:00 AM',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    type: 'tasks',
    title: 'Task assigned',
    message: 'You were assigned to "Update authentication flow"',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '6',
    type: 'messages',
    title: 'New message',
    message: 'Alex Kim mentioned you in a comment',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '7',
    type: 'files',
    title: 'File shared',
    message: 'Jessica Lee shared "Design_Mockups.fig" with you',
    read: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '8',
    type: 'tasks',
    title: 'Deadline approaching',
    message: 'Task "Prepare quarterly report" is due in 2 days',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getIcon = (type) => {
  switch (type) {
    case 'tasks':
      return Check;
    case 'messages':
      return MessageSquare;
    case 'files':
      return File;
    case 'system':
      return AlertCircle;
    default:
      return Bell;
  }
};

const getIconColor = (type) => {
  switch (type) {
    case 'tasks':
      return 'bg-green-500';
    case 'messages':
      return 'bg-blue-500';
    case 'files':
      return 'bg-purple-500';
    case 'system':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const Notifications = () => {
  const dispatch = useDispatch();
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Initialize with mock data
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: 'notifications/setNotifications', payload: mockNotifications });
      setIsLoading(false);
    };
    loadNotifications();
  }, [dispatch]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTypes = ['tasks', 'messages', 'files', 'system'];
      const titles = {
        tasks: ['Task completed', 'Task assigned', 'Task updated'],
        messages: ['New message', 'Mention', 'Comment reply'],
        files: ['File uploaded', 'File shared', 'File updated'],
        system: ['System notification', 'Reminder', 'Alert'],
      };
      const messages = {
        tasks: ['Someone completed a task', 'New task assigned to you', 'Task status changed'],
        messages: ['New message from team member', 'You were mentioned', 'Someone replied to your comment'],
        files: ['New file uploaded to project', 'File shared with you', 'File was updated'],
        system: ['System update available', 'Reminder for upcoming deadline', 'Security alert'],
      };

      const type = randomTypes[Math.floor(Math.random() * randomTypes.length)];
      const newNotification = {
        _id: Date.now().toString(),
        type,
        title: titles[type][Math.floor(Math.random() * titles[type].length)],
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        read: false,
        createdAt: new Date().toISOString(),
      };

      dispatch(addNotification(newNotification));
    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (id) => {
    dispatch(removeNotification(id));
    setShowDeleteConfirm(null);
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'tasks':
        return '/tasks';
      case 'messages':
        return '/messages';
      case 'files':
        return '/files';
      default:
        return '/';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </motion.button>
        )}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white/10 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Notification List */}
      <motion.div variants={itemVariants} className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => {
              const Icon = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);

              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border transition-all cursor-pointer hover:shadow-lg ${
                    notification.read
                      ? 'border-white/10 dark:border-gray-700/50'
                      : 'border-primary-500/30 dark:border-primary-400/30 bg-primary-500/5'
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      handleMarkAsRead(notification._id);
                    }
                  }}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full" />
                  )}

                  <div className={`flex items-start gap-4 p-4 ${!notification.read ? 'pl-5' : ''}`}>
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${iconColor}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white">{notification.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(notification._id);
                        }}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Delete confirmation overlay */}
                  <AnimatePresence>
                    {showDeleteConfirm === notification._id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-white font-medium">Delete this notification?</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification._id);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(null);
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ filter }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-12 text-center"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
      <Bell className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
    <p className="text-gray-500 dark:text-gray-400">
      {filter === 'all'
        ? "You're all caught up! Check back later."
        : `No ${filter} notifications at the moment.`}
    </p>
  </motion.div>
);

export default Notifications;