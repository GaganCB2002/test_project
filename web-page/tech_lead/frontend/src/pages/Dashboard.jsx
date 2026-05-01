import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Download,
  Layers,
  UserPlus,
  Activity,
  GitPullRequest,
  ShieldCheck,
  TrendingUp,
  CheckSquare,
  BarChart3,
  Code2,
  AlertCircle,
  MessageSquare,
  HardDrive,
  AreaChart,
  PieChart,
  BarChart,
  LineChart,
  Crown,
  User,
  Briefcase,
  Code,
  ArrowRight,
  Users,
  Zap,
} from 'lucide-react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

// Workflow role data
const workflowRoles = [
  { id: 'ceo', title: 'CEO', icon: Crown, gradient: 'from-violet-500 to-purple-600', level: 1 },
  { id: 'manager', title: 'Manager', icon: Briefcase, gradient: 'from-blue-500 to-cyan-600', level: 2 },
  { id: 'techlead', title: 'Tech Lead', icon: Zap, gradient: 'from-teal-500 to-emerald-600', level: 3 },
  { id: 'developers', title: 'Developers', icon: Users, gradient: 'from-amber-500 to-orange-600', level: 4 },
  { id: 'techlead-return', title: 'Tech Lead', icon: Zap, gradient: 'from-teal-500 to-emerald-600', level: 3 },
  { id: 'manager-return', title: 'Manager', icon: Briefcase, gradient: 'from-blue-500 to-cyan-600', level: 2 },
  { id: 'ceo-return', title: 'CEO', icon: Crown, gradient: 'from-violet-500 to-purple-600', level: 1 },
];

// Workflow steps data
const workflowSteps = [
  {
    id: 1,
    title: 'Receive Task',
    description: 'Download and review task assignments from manager',
    icon: Download,
    status: 'completed',
    statusColor: 'text-green-500 bg-green-500/10',
  },
  {
    id: 2,
    title: 'Breakdown & Planning',
    description: 'Analyze requirements and create detailed task breakdown',
    icon: Layers,
    status: 'in-progress',
    statusColor: 'text-blue-500 bg-blue-500/10',
  },
  {
    id: 3,
    title: 'Assign Tasks',
    description: 'Distribute tasks to team members based on skills',
    icon: UserPlus,
    status: 'pending',
    statusColor: 'text-yellow-500 bg-yellow-500/10',
  },
  {
    id: 4,
    title: 'Execution Tracking',
    description: 'Monitor progress and track daily standups',
    icon: Activity,
    status: 'pending',
    statusColor: 'text-yellow-500 bg-yellow-500/10',
  },
  {
    id: 5,
    title: 'Code Review',
    description: 'Review pull requests and provide feedback',
    icon: GitPullRequest,
    status: 'pending',
    statusColor: 'text-yellow-500 bg-yellow-500/10',
  },
  {
    id: 6,
    title: 'Testing & Integration',
    description: 'Ensure quality assurance and system integration',
    icon: ShieldCheck,
    status: 'pending',
    statusColor: 'text-yellow-500 bg-yellow-500/10',
  },
  {
    id: 7,
    title: 'Report to Manager',
    description: 'Submit progress reports and completion status',
    icon: TrendingUp,
    status: 'pending',
    statusColor: 'text-yellow-500 bg-yellow-500/10',
  },
];

// Key modules data
const keyModules = [
  {
    id: 1,
    title: 'Task Assignment System',
    icon: CheckSquare,
    gradient: 'from-primary-500 to-primary-600',
    stats: '24 tasks today',
  },
  {
    id: 2,
    title: 'Team Progress Tracker',
    icon: BarChart3,
    gradient: 'from-teal-500 to-teal-600',
    stats: '78% average',
  },
  {
    id: 3,
    title: 'Code Review UI',
    icon: Code2,
    gradient: 'from-secondary-500 to-secondary-600',
    stats: '12 pending reviews',
  },
  {
    id: 4,
    title: 'Issue Tracker',
    icon: AlertCircle,
    gradient: 'from-red-500 to-red-600',
    stats: '5 critical issues',
  },
  {
    id: 5,
    title: 'Performance Dashboard',
    icon: TrendingUp,
    gradient: 'from-amber-500 to-amber-600',
    stats: 'View metrics',
  },
  {
    id: 6,
    title: 'Communication Chat',
    icon: MessageSquare,
    gradient: 'from-pink-500 to-pink-600',
    stats: '3 unread messages',
  },
  {
    id: 7,
    title: 'File Manager',
    icon: HardDrive,
    gradient: 'from-gray-500 to-gray-600',
    stats: '128 files',
  },
];

// Chart data
const projectsChartData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 74 },
  { name: 'May', value: 82 },
  { name: 'Jun', value: 95 },
];

const tasksPieData = [
  { name: 'Completed', value: 127, color: '#22c55e' },
  { name: 'In Progress', value: 48, color: '#3b82f6' },
  { name: 'Pending', value: 35, color: '#f59e0b' },
];

const developerPerformanceData = [
  { name: 'Alex', tasks: 24, efficiency: 92 },
  { name: 'Sarah', tasks: 28, efficiency: 88 },
  { name: 'Mike', tasks: 21, efficiency: 95 },
  { name: 'Emma', tasks: 26, efficiency: 85 },
  { name: 'John', tasks: 19, efficiency: 90 },
];

const productivityData = [
  { name: 'Week 1', productivity: 72 },
  { name: 'Week 2', productivity: 78 },
  { name: 'Week 3', productivity: 85 },
  { name: 'Week 4', productivity: 92 },
];

const projectDistributionData = [
  { name: 'Active', value: 12, color: '#22c55e' },
  { name: 'Completed', value: 8, color: '#3b82f6' },
  { name: 'On Hold', value: 3, color: '#f59e0b' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tech Lead Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.name || 'Tech Lead'}. Here is your workflow overview.
        </p>
      </motion.div>

      {/* Workflow Flowchart Section */}
      <motion.div variants={itemVariants}>
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Workflow Flowchart
          </h2>
          <div className="relative overflow-x-auto pb-4">
            <div className="flex items-center justify-start gap-3 min-w-max">
              {workflowRoles.map((role, index) => {
                const Icon = role.icon;
                const isLast = index === workflowRoles.length - 1;
                return (
                  <div key={role.id} className="flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`relative backdrop-blur-xl bg-gradient-to-br ${role.gradient} rounded-xl p-4 w-28 h-28 flex flex-col items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white mb-2" />
                      <span className="text-xs font-medium text-white text-center">
                        {role.title}
                      </span>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          {role.level}
                        </span>
                      </div>
                    </motion.div>
                    {!isLast && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="relative mx-2"
                      >
                        <div className="w-8 h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full" />
                        <ArrowRight className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tech Lead Workflow Steps */}
      <motion.div variants={itemVariants}>
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Tech Lead Workflow Steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover="hover"
                  className="backdrop-blur-xl bg-white/5 dark:bg-gray-700/30 rounded-xl border border-white/10 dark:border-gray-700/50 p-4 cursor-pointer"
                >
                  <motion.div
                    variants={cardHoverVariants}
                    className="flex flex-col items-center text-center"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${step.icon ? 'from-primary-500 to-primary-600' : 'from-gray-500 to-gray-600'} mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {step.description}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${step.statusColor}`}>
                      {step.status.replace('-', ' ')}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Key Modules Section */}
      <motion.div variants={itemVariants}>
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Key Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {keyModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="backdrop-blur-xl bg-white/5 dark:bg-gray-700/30 rounded-xl border border-white/10 dark:border-gray-700/50 p-5 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${module.gradient} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {module.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {module.stats}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar for Team Progress Tracker */}
                  {module.id === 2 && (
                    <div className="mt-3">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '78%' }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  {/* Code Review UI mockup */}
                  {module.id === 3 && (
                    <div className="mt-3 p-2 bg-gray-900 dark:bg-black rounded-lg font-mono text-[9px] text-gray-300">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                      <div className="text-green-400">+ 127 new changes</div>
                      <div className="text-yellow-400">~ 12 files modified</div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Analytics Section */}
      <motion.div variants={itemVariants}>
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Total Projects Area Chart */}
            <div className="backdrop-blur-xl bg-white/5 dark:bg-gray-700/30 rounded-xl border border-white/10 dark:border-gray-700/50 p-4">
              <div className="flex items-center gap-2 mb-4">
                <AreaChart className="w-5 h-5 text-primary-500" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Total Projects
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsAreaChart data={projectsChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        color: darkMode ? '#fff' : '#1f2937',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorValue)"
                    />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Completed vs Pending Tasks PieChart */}
            <div className="backdrop-blur-xl bg-white/5 dark:bg-gray-700/30 rounded-xl border border-white/10 dark:border-gray-700/50 p-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-teal-500" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Completed vs Pending Tasks
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={tasksPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {tasksPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        color: darkMode ? '#fff' : '#1f2937',
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2">
                {tasksPieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Developer Performance BarChart */}
            <div className="backdrop-blur-xl bg-white/5 dark:bg-gray-700/30 rounded-xl border border-white/10 dark:border-gray-700/50 p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="w-5 h-5 text-secondary-500" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Developer Performance
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={developerPerformanceData} barGap={4}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        color: darkMode ? '#fff' : '#1f2937',
                      }}
                    />
                    <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Productivity Over Time LineChart */}
            <div className="backdrop-blur-xl bg-white/5 dark:bg-gray-700/30 rounded-xl border border-white/10 dark:border-gray-700/50 p-4">
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Productivity Over Time
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={productivityData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        color: darkMode ? '#fff' : '#1f2937',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="productivity"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project Distribution PieChart */}
            <div className="backdrop-blur-xl bg-white/5 dark:bg-gray-700/30 rounded-xl border border-white/10 dark:border-gray-700/50 p-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-pink-500" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Project Distribution
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={projectDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        color: darkMode ? '#fff' : '#1f2937',
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2">
                {projectDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
