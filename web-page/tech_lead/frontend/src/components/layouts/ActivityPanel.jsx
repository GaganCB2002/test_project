import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckSquare,
  File,
  GitCommit,
  AlertCircle,
  Plus,
  UserPlus,
  MessageSquare,
  Bell,
} from 'lucide-react';

const activityIcons = {
  task: CheckSquare,
  file: File,
  commit: GitCommit,
  issue: AlertCircle,
  member: UserPlus,
  message: MessageSquare,
  notification: Bell,
  default: Bell,
};

const activityColors = {
  task: 'bg-green-500',
  file: 'bg-blue-500',
  commit: 'bg-purple-500',
  issue: 'bg-red-500',
  member: 'bg-indigo-500',
  message: 'bg-yellow-500',
  notification: 'bg-gray-500',
  default: 'bg-gray-500',
};

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function ActivityPanel() {
  const { activities } = useSelector((state) => state.ui);
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const latestActivities = activities?.slice(0, 20) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed right-0 top-0 h-screen w-80 bg-white/10 backdrop-blur-xl border-l border-white/20 dark:bg-gray-900/50 dark:border-gray-700/50 z-30 flex flex-col`}
        style={{ marginTop: 64 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Live Activity</h2>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {latestActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Activity will appear here in real-time
              </p>
            </div>
          ) : (
            latestActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type] || activityIcons.default;
              const color = activityColors[activity.type] || activityColors.default;

              return (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-800/30 hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {activity.userAvatar ? (
                      <img
                        src={activity.userAvatar}
                        alt={activity.userName || 'User'}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {activity.userName
                          ? activity.userName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)
                          : 'U'}
                      </div>
                    )}
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 ${color} rounded-full flex items-center justify-center`}
                    >
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-medium">{activity.userName || 'User'}</span>{' '}
                      {activity.action}
                    </p>
                    {activity.target && (
                      <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5 truncate">
                        {activity.target}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {timeAgo(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}