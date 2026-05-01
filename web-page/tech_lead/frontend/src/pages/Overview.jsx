import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  Plus,
  Send,
  BarChart3,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Motivational quotes
const quotes = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Teamwork makes the dream work.", author: "John C. Maxwell" },
  { text: "Leadership is not about being in charge, it's about taking care of those in your charge.", author: "Simon Sinek" },
  { text: "Quality is not an act, it's a habit.", author: "Aristotle" },
];

// Mock data for overview
const mockStats = {
  totalProjects: 12,
  activeTasks: 28,
  teamMembers: 8,
  pendingReports: 5,
};

// Mock upcoming deadlines
const upcomingDeadlines = [
  { id: 1, title: 'Design Review Meeting', dueDate: '2026-04-28', priority: 'high', status: 'pending' },
  { id: 2, title: 'API Integration Completion', dueDate: '2026-04-29', priority: 'medium', status: 'in-progress' },
  { id: 3, title: 'Client Presentation Draft', dueDate: '2026-04-30', priority: 'high', status: 'pending' },
  { id: 4, title: 'Code Review Session', dueDate: '2026-05-01', priority: 'low', status: 'pending' },
  { id: 5, title: 'Sprint Retrospective', dueDate: '2026-05-02', priority: 'medium', status: 'pending' },
];

// Mock my tasks
const myTasks = [
  { id: 1, title: 'Review team pull requests', priority: 'high', status: 'in-progress' },
  { id: 2, title: 'Update project documentation', priority: 'medium', status: 'pending' },
  { id: 3, title: 'Conduct 1:1 with team members', priority: 'medium', status: 'pending' },
  { id: 4, title: 'Prepare quarterly report', priority: 'high', status: 'pending' },
];

// Mini chart data for productivity
const productivityData = [
  { day: 'Mon', completed: 4, pending: 2 },
  { day: 'Tue', completed: 6, pending: 1 },
  { day: 'Wed', completed: 3, pending: 3 },
  { day: 'Thu', completed: 5, pending: 2 },
  { day: 'Fri', completed: 7, pending: 1 },
  { day: 'Sat', completed: 2, pending: 1 },
  { day: 'Sun', completed: 1, pending: 0 },
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-500 bg-red-500/10';
    case 'medium': return 'text-yellow-500 bg-yellow-500/10';
    case 'low': return 'text-green-500 bg-green-500/10';
    default: return 'text-gray-500 bg-gray-500/10';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'text-green-500';
    case 'in-progress': return 'text-blue-500';
    case 'pending': return 'text-gray-400';
    default: return 'text-gray-500';
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.2 },
  },
};

const Overview = () => {
  const { user } = useSelector((state) => state.auth);
  const userName = user?.name || 'Tech Lead';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="glass-morphism rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {userName.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{today}</p>
            </div>
            <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl border border-primary-500/20">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300 italic">"{randomQuote.text}"</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          initial="rest"
          animate="rest"
          className="group glass-morphism rounded-2xl border border-white/20 dark:border-gray-700/50 p-5 cursor-pointer"
        >
          <CardHoverEffect variants={cardHoverVariants}>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.totalProjects}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
          </CardHoverEffect>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover="hover"
          initial="rest"
          animate="rest"
          className="group glass-morphism rounded-2xl border border-white/20 dark:border-gray-700/50 p-5 cursor-pointer"
        >
          <CardHoverEffect variants={cardHoverVariants}>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.activeTasks}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">Active Tasks</p>
          </CardHoverEffect>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover="hover"
          initial="rest"
          animate="rest"
          className="group glass-morphism rounded-2xl border border-white/20 dark:border-gray-700/50 p-5 cursor-pointer"
        >
          <CardHoverEffect variants={cardHoverVariants}>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.teamMembers}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
          </CardHoverEffect>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover="hover"
          initial="rest"
          animate="rest"
          className="group glass-morphism rounded-2xl border border-white/20 dark:border-gray-700/50 p-5 cursor-pointer"
        >
          <CardHoverEffect variants={cardHoverVariants}>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.pendingReports}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reports</p>
          </CardHoverEffect>
        </motion.div>
      </div>

      {/* Quick Actions Row */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickActionButton icon={Plus} label="Create Project" color="primary" />
          <QuickActionButton icon={CheckSquare} label="Create Task" color="teal" />
          <QuickActionButton icon={Send} label="Send Message" color="secondary" />
          <QuickActionButton icon={BarChart3} label="Generate Report" color="amber" />
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity & Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <div className="glass-morphism rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
              </div>
              <div className="p-4 space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <motion.div
                    key={deadline.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{deadline.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(deadline.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                      {deadline.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* My Tasks */}
          <motion.div variants={itemVariants}>
            <div className="glass-morphism rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Tasks</h2>
              </div>
              <div className="p-4 space-y-3">
                {myTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status).replace('text-', 'bg-')}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{task.title}</p>
                      <p className={`text-xs ${getStatusColor(task.status)} capitalize`}>{task.status.replace('-', ' ')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-white/10 dark:border-gray-700/50">
                <button className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors">
                  View all tasks
                </button>
              </div>
            </div>
          </motion.div>

          {/* Productivity Chart */}
          <motion.div variants={itemVariants}>
            <div className="glass-morphism rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Productivity Chart</h2>
              </div>
              <div className="p-4">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productivityData} barGap={4}>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(31, 41, 55, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      />
                      <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-secondary-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper component for card hover effects
const CardHoverEffect = ({ children, variants }) => (
  <motion.div variants={variants}>
    {children}
  </motion.div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, color }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
    teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
    secondary: 'from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700',
    amber: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${colorClasses[color]} rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </motion.button>
  );
};

export default Overview;