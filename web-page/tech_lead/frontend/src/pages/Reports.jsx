import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Download,
  Edit,
  Share2,
  Eye,
  X,
  Calendar,
  User,
  ChevronDown,
  FileBarChart,
  Printer,
  Mail,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';

// Report types
const reportTypes = ['Daily', 'Weekly', 'Monthly'];

const COLORS = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444'];

// Mock reports data
const mockReports = [
  {
    _id: '1',
    title: 'Sprint 12 Performance Summary',
    type: 'Weekly',
    author: { name: 'Alex Kim', avatar: 'AK' },
    project: 'E-Commerce Platform',
    dateRange: { start: '2026-04-14', end: '2026-04-20' },
    createdDate: '2026-04-21',
    content: 'This week we completed 23 tasks, resolved 8 bugs, and delivered 3 major features...',
    views: 145,
  },
  {
    _id: '2',
    title: 'March 2026 Analytics Report',
    type: 'Monthly',
    author: { name: 'Sarah Chen', avatar: 'SC' },
    project: 'Analytics Dashboard',
    dateRange: { start: '2026-03-01', end: '2026-03-31' },
    createdDate: '2026-04-01',
    content: 'March saw a 34% increase in user engagement and a 22% improvement in conversion rates...',
    views: 289,
  },
  {
    _id: '3',
    title: 'Daily Standup Notes - April 27',
    type: 'Daily',
    author: { name: 'Mike Johnson', avatar: 'MJ' },
    project: 'API Gateway',
    dateRange: { start: '2026-04-27', end: '2026-04-27' },
    createdDate: '2026-04-27',
    content: 'Team discussed progress on authentication module, identified blockers with OAuth implementation...',
    views: 42,
  },
  {
    _id: '4',
    title: 'Sprint 11 Retrospective Report',
    type: 'Weekly',
    author: { name: 'Emma Davis', avatar: 'ED' },
    project: 'Mobile Banking App',
    dateRange: { start: '2026-04-07', end: '2026-04-13' },
    createdDate: '2026-04-14',
    content: 'Completed 31 story points, velocity increased by 15% compared to sprint 10...',
    views: 98,
  },
  {
    _id: '5',
    title: 'Q1 2026 Development Overview',
    type: 'Monthly',
    author: { name: 'Alex Kim', avatar: 'AK' },
    project: 'All Projects',
    dateRange: { start: '2026-01-01', end: '2026-03-31' },
    createdDate: '2026-04-05',
    content: 'Q1 was highly productive with 156 tasks completed, 3 major releases, and zero critical bugs...',
    views: 412,
  },
  {
    _id: '6',
    title: 'Daily Progress Report - April 26',
    type: 'Daily',
    author: { name: 'James Wilson', avatar: 'JW' },
    project: 'E-Commerce Platform',
    dateRange: { start: '2026-04-26', end: '2026-04-26' },
    createdDate: '2026-04-26',
    content: 'Completed product API endpoints, resolved database connection pooling issues...',
    views: 38,
  },
];

// Mock projects for select
const mockProjects = [
  { _id: '1', name: 'E-Commerce Platform' },
  { _id: '2', name: 'Mobile Banking App' },
  { _id: '3', name: 'Analytics Dashboard' },
  { _id: '4', name: 'API Gateway' },
  { _id: '5', name: 'All Projects' },
];

// Mock stats for charts
const statsData = {
  totalReports: 24,
  thisWeek: 5,
  thisMonth: 12,
  totalViews: 1892,
};

const typeDistribution = [
  { name: 'Daily', value: 10 },
  { name: 'Weekly', value: 8 },
  { name: 'Monthly', value: 6 },
];

const monthlyTrend = [
  { name: 'Jan', reports: 3 },
  { name: 'Feb', reports: 5 },
  { name: 'Mar', reports: 4 },
  { name: 'Apr', reports: 6 },
];

function Reports() {
  const [reports, setReports] = useState(mockReports);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // New report form state
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'Daily',
    content: '',
    project: '',
    dateRange: { start: '', end: '' },
  });

  // Share modal state
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesFilter = activeFilter === 'All' || report.type === activeFilter;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());

    // Date range filter
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const reportDate = new Date(report.dateRange.start);
      matchesDateRange = isWithinInterval(reportDate, {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end),
      });
    }

    return matchesFilter && matchesSearch && matchesDateRange;
  });

  const handleCreateReport = () => {
    const report = {
      _id: Date.now().toString(),
      title: newReport.title,
      type: newReport.type,
      author: { name: 'You', avatar: 'YO' },
      project: newReport.project,
      dateRange: newReport.dateRange,
      createdDate: new Date().toISOString().split('T')[0],
      content: newReport.content,
      views: 0,
    };
    setReports([report, ...reports]);
    setShowCreateModal(false);
    setNewReport({ title: '', type: 'Daily', content: '', project: '', dateRange: { start: '', end: '' } });
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleEdit = (report) => {
    console.log('Editing:', report.title);
  };

  const handleExport = (report) => {
    console.log('Exporting to PDF:', report.title);
    alert(`Exporting "${report.title}" to PDF...`);
  };

  const handleShare = (report) => {
    setSelectedReport(report);
    setShowShareModal(true);
  };

  const handleShareSubmit = () => {
    console.log('Sharing to:', shareEmail);
    alert(`Report shared to ${shareEmail}`);
    setShowShareModal(false);
    setShareEmail('');
    setShareMessage('');
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'Daily':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Weekly':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Monthly':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and analyze your reports</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus size={18} />
          Create Report
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileBarChart className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.totalReports}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.thisWeek}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.thisMonth}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.totalViews}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Type Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Report Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="reports" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
      >
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {['All', 'Daily', 'Weekly', 'Monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${activeFilter === tab
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Date Range */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input-field w-36"
              placeholder="Start date"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input-field w-36"
              placeholder="End date"
            />
          </div>
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredReports.map((report, index) => (
          <motion.div
            key={report._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Report Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-primary-500" />
              </div>

              {/* Report Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                    {report.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getTypeBadgeColor(report.type)}`}>
                    {report.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {report.content}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-500">{report.author.avatar}</span>
                    </div>
                    <span>{report.author.name}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(report.dateRange.start), 'MMM d')} - {format(new Date(report.dateRange.end), 'MMM d, yyyy')}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                    {report.project}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {report.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(report.createdDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleViewDetail(report)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="View"
                >
                  <Eye className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => handleEdit(report)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => handleExport(report)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Export PDF"
                >
                  <Printer className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => handleShare(report)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No reports found</p>
          </div>
        )}
      </motion.div>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Report</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter report title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Type
                  </label>
                  <div className="flex items-center gap-2">
                    {['Daily', 'Weekly', 'Monthly'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setNewReport({ ...newReport, type })}
                        className={`
                          px-4 py-2 rounded-lg font-medium text-sm transition-all
                          ${newReport.type === type
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project
                  </label>
                  <select
                    value={newReport.project}
                    onChange={(e) => setNewReport({ ...newReport, project: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select a project</option>
                    {mockProjects.map((project) => (
                      <option key={project._id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newReport.dateRange.start}
                      onChange={(e) => setNewReport({ ...newReport, dateRange: { ...newReport.dateRange, start: e.target.value } })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newReport.dateRange.end}
                      onChange={(e) => setNewReport({ ...newReport, dateRange: { ...newReport.dateRange, end: e.target.value } })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newReport.content}
                    onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                    className="input-field min-h-[120px] resize-none"
                    placeholder="Enter report content..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button onClick={handleCreateReport} className="btn-primary flex-1">
                    <CheckCircle size={18} />
                    Create Report
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-xl">{selectedReport.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(selectedReport.type)}`}>
                        {selectedReport.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedReport.project}</p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Author</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-500">{selectedReport.author.avatar}</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedReport.author.name}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedReport.createdDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date Range</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedReport.dateRange.start), 'MMM d')} - {format(new Date(selectedReport.dateRange.end), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Views</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedReport.views}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Content</p>
                  <p className="text-gray-900 dark:text-white leading-relaxed">{selectedReport.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button onClick={() => handleExport(selectedReport)} className="btn-primary flex-1">
                    <Printer size={18} />
                    Export to PDF
                  </button>
                  <button onClick={() => handleShare(selectedReport)} className="btn-secondary flex-1">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button onClick={() => handleEdit(selectedReport)} className="btn-ghost flex-1">
                    <Edit size={18} />
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Report</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="font-medium text-gray-900 dark:text-white">{selectedReport.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedReport.type} Report</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter recipient's email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Add a message..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button onClick={handleShareSubmit} className="btn-primary flex-1">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Reports;