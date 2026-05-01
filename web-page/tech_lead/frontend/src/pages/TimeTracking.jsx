import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar,
  Timer,
  TrendingUp,
  Plus,
  Download,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const mockTimeEntries = [
  { id: '1', date: '2026-04-27', project: 'Tech Lead Dashboard', task: 'Implement Settings page', duration: 240, description: 'Created Settings.jsx with all tabs', user: 'SC' },
  { id: '2', date: '2026-04-27', project: 'Tech Lead Dashboard', task: 'Code review', duration: 90, description: 'Reviewed PR from team member', user: 'SC' },
  { id: '3', date: '2026-04-26', project: 'Mobile App Redesign', task: 'API integration', duration: 180, description: 'Connected frontend to backend APIs', user: 'SC' },
  { id: '4', date: '2026-04-26', project: 'E-commerce Platform', task: 'Bug fixes', duration: 120, description: 'Fixed checkout flow issues', user: 'SC' },
  { id: '5', date: '2026-04-25', project: 'Tech Lead Dashboard', task: 'Team meeting', duration: 60, description: 'Sprint planning and standup', user: 'SC' },
  { id: '6', date: '2026-04-25', project: 'Mobile App Redesign', task: 'UI implementation', duration: 210, description: 'Built responsive dashboard layout', user: 'SC' },
  { id: '7', date: '2026-04-24', project: 'E-commerce Platform', task: 'Performance optimization', duration: 150, description: 'Improved page load times', user: 'SC' },
  { id: '8', date: '2026-04-24', project: 'Tech Lead Dashboard', task: 'Documentation', duration: 45, description: 'Updated README and API docs', user: 'SC' },
  { id: '9', date: '2026-04-23', project: 'Mobile App Redesign', task: 'Authentication flow', duration: 180, description: 'Implemented OAuth2 login', user: 'SC' },
  { id: '10', date: '2026-04-23', project: 'Tech Lead Dashboard', task: 'Database design', duration: 120, description: 'Designed schema for notifications', user: 'SC' },
];

const mockProjects = [
  { id: '1', name: 'Tech Lead Dashboard' },
  { id: '2', name: 'Mobile App Redesign' },
  { id: '3', name: 'E-commerce Platform' },
];

const mockTasks = {
  '1': ['Implement Settings page', 'Code review', 'Team meeting', 'Documentation', 'Database design'],
  '2': ['API integration', 'UI implementation', 'Authentication flow'],
  '3': ['Bug fixes', 'Performance optimization'],
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatDurationDecimal = (minutes) => {
  return (minutes / 60).toFixed(1);
};

const getWeekDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const getMonthDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const TimeTracking = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState(mockTimeEntries);
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [expandedDates, setExpandedDates] = useState(['2026-04-27', '2026-04-26']);

  // Filters
  const [dateRange, setDateRange] = useState('week');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedTask, setSelectedTask] = useState('all');

  // Log form state
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    task: '',
    duration: '',
    description: '',
  });

  // Load data
  useState(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const weekDates = getWeekDates();
    const monthDates = getMonthDates();

    const weekEntries = entries.filter((e) => weekDates.includes(e.date));
    const monthEntries = entries.filter((e) => monthDates.includes(e.date));

    const weekHours = weekEntries.reduce((sum, e) => sum + e.duration, 0);
    const monthHours = monthEntries.reduce((sum, e) => sum + e.duration, 0);
    const avgDaily = weekHours / 7;

    // Find most active project this week
    const projectHours = {};
    weekEntries.forEach((e) => {
      projectHours[e.project] = (projectHours[e.project] || 0) + e.duration;
    });
    const mostActiveProject = Object.entries(projectHours).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      weekHours,
      monthHours,
      avgDaily: Math.round(avgDaily),
      mostActiveProject,
    };
  }, [entries]);

  // Chart data
  const chartData = useMemo(() => {
    if (dateRange === 'week') {
      const weekDates = getWeekDates();
      return weekDates.map((date) => {
        const dayEntries = entries.filter((e) => e.date === date);
        const totalMinutes = dayEntries.reduce((sum, e) => sum + e.duration, 0);
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        return { day: dayName, hours: parseFloat((totalMinutes / 60).toFixed(1)), date };
      });
    } else {
      const monthDates = getMonthDates();
      return monthDates.map((date) => {
        const dayEntries = entries.filter((e) => e.date === date);
        const totalMinutes = dayEntries.reduce((sum, e) => sum + e.duration, 0);
        const dayNum = new Date(date).getDate();
        return { day: dayNum.toString(), hours: parseFloat((totalMinutes / 60).toFixed(1)), date };
      });
    }
  }, [entries, dateRange]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (selectedProject !== 'all' && entry.project !== selectedProject) return false;
      if (selectedTask !== 'all' && entry.task !== selectedTask) return false;
      return true;
    });
  }, [entries, selectedProject, selectedTask]);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups = {};
    filteredEntries.forEach((entry) => {
      if (!groups[entry.date]) {
        groups[entry.date] = {
          date,
          entries: [],
          totalMinutes: 0,
        };
      }
      groups[entry.date].entries.push(entry);
      groups[entry.date].totalMinutes += entry.duration;
    });

    // Convert to array and sort by date descending
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredEntries]);

  const handleLogTime = () => {
    const { date, project, task, duration, description } = logForm;
    if (!project || !task || !duration) return;

    const newEntry = {
      id: Date.now().toString(),
      date,
      project: mockProjects.find((p) => p.id === project)?.name || project,
      task,
      duration: parseInt(duration),
      description,
      user: 'SC',
    };

    if (editingEntry) {
      setEntries((prev) => prev.map((e) => (e.id === editingEntry.id ? newEntry : e)));
      setEditingEntry(null);
    } else {
      setEntries((prev) => [newEntry, ...prev]);
    }

    setShowLogModal(false);
    setLogForm({ date: new Date().toISOString().split('T')[0], project: '', task: '', duration: '', description: '' });
  };

  const handleEditEntry = (entry) => {
    setLogForm({
      date: entry.date,
      project: mockProjects.find((p) => p.name === entry.project)?.id || '',
      task: entry.task,
      duration: entry.duration.toString(),
      description: entry.description,
    });
    setEditingEntry(entry);
    setShowLogModal(true);
  };

  const handleDeleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Project', 'Task', 'Duration (hours)', 'Description', 'User'];
    const rows = entries.map((e) => [
      e.date,
      e.project,
      e.task,
      formatDurationDecimal(e.duration),
      e.description,
      e.user,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `time-tracking-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const toggleDateExpand = (date) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const availableTasks = logForm.project ? mockTasks[logForm.project] || [] : [];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading time tracking...</p>
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
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Tracking</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and log your working hours</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 dark:bg-gray-800/50 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 backdrop-blur-xl bg-gray-800/90 rounded-xl border border-gray-700/50 overflow-hidden z-20"
                >
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-3 text-left text-white hover:bg-gray-700/50 transition-colors text-sm"
                  >
                    Export as CSV
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingEntry(null);
              setLogForm({ date: new Date().toISOString().split('T')[0], project: '', task: '', duration: '', description: '' });
              setShowLogModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Log Time
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(stats.weekHours)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(stats.monthHours)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgDaily}h</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Most Active</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{stats.mostActiveProject}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters & Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>

            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input-field"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  setSelectedTask('all');
                }}
                className="input-field"
              >
                <option value="all">All Projects</option>
                {mockProjects.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {selectedProject !== 'all' && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Task</label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Tasks</option>
                  {mockTasks[mockProjects.find((p) => p.name === selectedProject)?.id]?.map((task) => (
                    <option key={task} value={task}>{task}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Hours Chart</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickFormatter={(v) => `${v}h`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value) => [`${value} hours`, 'Logged']}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 4 ? '#3b82f6' : '#60a5fa'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Time Entries */}
      <motion.div variants={itemVariants}>
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-white">Time Entries</h3>
          </div>

          <div className="divide-y divide-gray-200/20 dark:divide-gray-700/30">
            {groupedEntries.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No time entries found</p>
              </div>
            ) : (
              groupedEntries.map((group) => {
                const isExpanded = expandedDates.includes(group.date);
                const dateLabel = new Date(group.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                });
                const isToday = group.date === new Date().toISOString().split('T')[0];

                return (
                  <div key={group.date}>
                    {/* Date Header */}
                    <button
                      onClick={() => toggleDateExpand(group.date)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {dateLabel}
                          {isToday && <span className="ml-2 text-primary-500 text-sm">(Today)</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDuration(group.totalMinutes)}
                        </span>
                        <span className="badge badge-primary">{group.entries.length} entries</span>
                      </div>
                    </button>

                    {/* Entries */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 space-y-2">
                            {group.entries.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center gap-4 p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl group"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xs font-medium">
                                  {entry.user}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 dark:text-white truncate">{entry.task}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900 dark:text-white">{formatDuration(entry.duration)}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">{entry.project}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEditEntry(entry)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>

      {/* Log Time Modal */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md backdrop-blur-xl bg-gray-800/95 rounded-2xl border border-gray-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {editingEntry ? 'Edit Time Entry' : 'Log Time'}
                </h3>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date</label>
                  <input
                    type="date"
                    value={logForm.date}
                    onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                    className="input-field bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Project</label>
                  <select
                    value={logForm.project}
                    onChange={(e) => setLogForm({ ...logForm, project: e.target.value, task: '' })}
                    className="input-field bg-gray-700/50 border-gray-600 text-white"
                  >
                    <option value="">Select project</option>
                    {mockProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Task</label>
                  <select
                    value={logForm.task}
                    onChange={(e) => setLogForm({ ...logForm, task: e.target.value })}
                    className="input-field bg-gray-700/50 border-gray-600 text-white"
                    disabled={!logForm.project}
                  >
                    <option value="">Select task</option>
                    {availableTasks.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={logForm.duration}
                    onChange={(e) => setLogForm({ ...logForm, duration: e.target.value })}
                    placeholder="e.g. 60"
                    min="1"
                    className="input-field bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={logForm.description}
                    onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                    rows={3}
                    placeholder="What did you work on?"
                    className="input-field bg-gray-700/50 border-gray-600 text-white resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogTime}
                    disabled={!logForm.project || !logForm.task || !logForm.duration}
                    className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingEntry ? 'Update' : 'Log Time'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TimeTracking;