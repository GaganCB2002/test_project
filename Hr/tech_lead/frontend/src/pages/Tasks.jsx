import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  List,
  LayoutGrid,
  MoreVertical,
  User,
  Flag,
  ArrowRight,
  GripVertical,
  Bug,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  addTask,
  updateTask,
  removeTask,
  updateTaskStatus,
  setCurrent,
} from '../store/slices/taskSlice';

// Task statuses
const statuses = [
  { id: 'todo', label: 'Todo', color: 'bg-gray-500/20 text-gray-500 border-gray-500' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-500/20 text-blue-500 border-blue-500' },
  { id: 'review', label: 'Review', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500' },
  { id: 'testing', label: 'Testing', color: 'bg-purple-500/20 text-purple-500 border-purple-500' },
  { id: 'done', label: 'Done', color: 'bg-green-500/20 text-green-500 border-green-500' },
];

// Priority configs
const priorityConfig = {
  high: { color: 'bg-red-500/20 text-red-500 border-red-500', label: 'High' },
  medium: { color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500', label: 'Medium' },
  low: { color: 'bg-green-500/20 text-green-500 border-green-500', label: 'Low' },
};

// Mock team members
const mockMembers = [
  { id: '1', name: 'Alex Kim', avatar: 'AK' },
  { id: '2', name: 'Sarah Chen', avatar: 'SC' },
  { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
  { id: '4', name: 'Emma Davis', avatar: 'ED' },
  { id: '5', name: 'James Wilson', avatar: 'JW' },
];

// Mock projects
const mockProjects = [
  { _id: '1', name: 'E-Commerce Platform' },
  { _id: '2', name: 'Mobile Banking App' },
  { _id: '3', name: 'Analytics Dashboard' },
  { _id: '4', name: 'API Gateway' },
];

// Initial tasks
const initialTasks = [
  {
    _id: '1',
    title: 'Implement user authentication',
    description: 'Add OAuth2 and JWT authentication to the platform with social login support.',
    status: 'done',
    priority: 'high',
    assignee: mockMembers[0],
    projectId: '1',
    projectName: 'E-Commerce Platform',
    dueDate: '2026-04-20',
    estimatedHours: 16,
  },
  {
    _id: '2',
    title: 'Design database schema',
    description: 'Create PostgreSQL schema for products, orders, and users with proper indexing.',
    status: 'done',
    priority: 'high',
    assignee: mockMembers[1],
    projectId: '1',
    projectName: 'E-Commerce Platform',
    dueDate: '2026-04-15',
    estimatedHours: 8,
  },
  {
    _id: '3',
    title: 'Build product catalog API',
    description: 'RESTful API endpoints for product CRUD operations with pagination and filtering.',
    status: 'in-progress',
    priority: 'high',
    assignee: mockMembers[2],
    projectId: '1',
    projectName: 'E-Commerce Platform',
    dueDate: '2026-04-25',
    estimatedHours: 12,
  },
  {
    _id: '4',
    title: 'Mobile app navigation',
    description: 'Implement tab-based navigation with deep linking support for iOS and Android.',
    status: 'review',
    priority: 'medium',
    assignee: mockMembers[3],
    projectId: '2',
    projectName: 'Mobile Banking App',
    dueDate: '2026-04-28',
    estimatedHours: 10,
  },
  {
    _id: '5',
    title: 'Biometric authentication',
    description: 'Add Face ID and fingerprint authentication for secure mobile banking.',
    status: 'testing',
    priority: 'high',
    assignee: mockMembers[4],
    projectId: '2',
    projectName: 'Mobile Banking App',
    dueDate: '2026-04-30',
    estimatedHours: 20,
  },
  {
    _id: '6',
    title: 'Analytics dashboard widgets',
    description: 'Create customizable widget components for the analytics dashboard.',
    status: 'in-progress',
    priority: 'medium',
    assignee: mockMembers[0],
    projectId: '3',
    projectName: 'Analytics Dashboard',
    dueDate: '2026-05-05',
    estimatedHours: 15,
  },
  {
    _id: '7',
    title: 'Real-time data streaming',
    description: 'Implement WebSocket connection for real-time analytics data updates.',
    status: 'todo',
    priority: 'high',
    assignee: mockMembers[1],
    projectId: '3',
    projectName: 'Analytics Dashboard',
    dueDate: '2026-05-10',
    estimatedHours: 18,
  },
  {
    _id: '8',
    title: 'API rate limiting',
    description: 'Implement rate limiting middleware with Redis-based token bucket algorithm.',
    status: 'todo',
    priority: 'medium',
    assignee: mockMembers[2],
    projectId: '4',
    projectName: 'API Gateway',
    dueDate: '2026-05-12',
    estimatedHours: 8,
  },
  {
    _id: '9',
    title: 'Payment integration testing',
    description: 'Comprehensive E2E tests for Stripe payment processing flow.',
    status: 'todo',
    priority: 'high',
    assignee: mockMembers[3],
    projectId: '1',
    projectName: 'E-Commerce Platform',
    dueDate: '2026-05-08',
    estimatedHours: 12,
  },
  {
    _id: '10',
    title: 'Push notifications service',
    description: 'Firebase Cloud Messaging integration for mobile push notifications.',
    status: 'todo',
    priority: 'low',
    assignee: mockMembers[4],
    projectId: '2',
    projectName: 'Mobile Banking App',
    dueDate: '2026-05-15',
    estimatedHours: 10,
  },
];

const initialFormState = {
  title: '',
  description: '',
  projectId: '',
  assigneeId: '',
  priority: 'medium',
  dueDate: '',
  estimatedHours: '',
};

const Tasks = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { items: storeTasks } = useSelector((state) => state.tasks);

  const [tasks, setTasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
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

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assignee?.id === assigneeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Group tasks by status for kanban
  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status.id] = filteredTasks.filter((t) => t.status === status.id);
    return acc;
  }, {});

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignee = mockMembers.find((m) => m.id === formData.assigneeId);
    const project = mockProjects.find((p) => p._id === formData.projectId);

    if (editingTask) {
      const updated = tasks.map((t) =>
        t._id === editingTask._id
          ? {
              ...t,
              title: formData.title,
              description: formData.description,
              projectId: formData.projectId,
              projectName: project?.name || t.projectName,
              assignee,
              priority: formData.priority,
              dueDate: formData.dueDate,
              estimatedHours: parseInt(formData.estimatedHours) || 0,
            }
          : t
      );
      setTasks(updated);
      dispatch(updateTask({ ...editingTask, ...formData, assignee, projectName: project?.name }));
    } else {
      const newTask = {
        _id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: 'todo',
        projectId: formData.projectId,
        projectName: project?.name || 'No Project',
        assignee,
        priority: formData.priority,
        dueDate: formData.dueDate,
        estimatedHours: parseInt(formData.estimatedHours) || 0,
      };
      setTasks([newTask, ...tasks]);
      dispatch(addTask(newTask));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((t) => t._id !== id));
      dispatch(removeTask(id));
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      assigneeId: task.assignee?.id || '',
      priority: task.priority,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours?.toString() || '',
    });
    setShowModal(true);
  };

  const openDetailModal = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData(initialFormState);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const getStatusBadge = (status) => {
    const config = statuses.find((s) => s.id === status) || statuses[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {status === 'done' && <CheckCircle className="w-3 h-3" />}
        {status === 'in-progress' && <Clock className="w-3 h-3" />}
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
        {priority === 'high' && <AlertCircle className="w-3 h-3" />}
        {config.label}
      </span>
    );
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your team tasks
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </motion.button>
      </motion.div>

      {/* Search, Filter, and View Toggle */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border transition-all ${
              showFilters
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white/10 dark:bg-gray-800/30 border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
          </motion.button>
          <div className="flex items-center gap-1 p-1 bg-white/10 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-white/10'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-white/10'}`}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-4 p-4 bg-white/5 dark:bg-gray-800/20 rounded-xl border border-white/10 dark:border-gray-700/50">
              {/* Status Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <option value="all">All Status</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Assignee Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Assignee</label>
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="px-3 py-2 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <option value="all">All Assignees</option>
                  {mockMembers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setAssigneeFilter('all');
                  }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  Clear Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <motion.div variants={containerVariants} className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {statuses.map((status) => (
              <div key={status.id} className="w-80 flex-shrink-0">
                {/* Column Header */}
                <div className="flex items-center justify-between p-3 mb-3 rounded-xl bg-white/5 dark:bg-gray-800/30 border border-white/10 dark:border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${status.color.split(' ')[0]}`} />
                    <span className="font-medium text-gray-900 dark:text-white">{status.label}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-white/10 dark:bg-gray-700/50 rounded-full text-xs text-gray-500 dark:text-gray-400">
                    {tasksByStatus[status.id]?.length || 0}
                  </span>
                </div>

                {/* Column Content */}
                <div className="space-y-3 min-h-[200px]">
                  <AnimatePresence mode="popLayout">
                    {tasksByStatus[status.id]?.map((task) => (
                      <motion.div
                        key={task._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        onClick={() => openDetailModal(task)}
                        className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/50 p-4 cursor-pointer"
                      >
                        {/* Title and Menu */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">{task.title}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(task);
                            }}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Description Preview */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                          {task.description}
                        </p>

                        {/* Project */}
                        <p className="text-xs text-primary-500 mb-3">{task.projectName}</p>

                        {/* Meta Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(task.priority)}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-[10px] font-medium text-white">
                              {task.assignee?.avatar}
                            </div>
                          </div>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className={isOverdue(task.dueDate) ? 'text-red-500' : ''}>
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <motion.div variants={containerVariants} className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => openDetailModal(task)}
                className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/50 p-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Left Section */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Drag Handle */}
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab flex-shrink-0" />

                    {/* Title and Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">{task.title}</h4>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</p>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Status */}
                    <div className="w-32">{getStatusBadge(task.status)}</div>

                    {/* Project */}
                    <div className="w-40 text-sm text-gray-500 dark:text-gray-400 text-right truncate">
                      {task.projectName}
                    </div>

                    {/* Assignee */}
                    <div className="flex items-center gap-2 w-28">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-xs font-medium text-white">
                        {task.assignee?.avatar}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{task.assignee?.name}</span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-1 w-24 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className={isOverdue(task.dueDate) ? 'text-red-500' : ''}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(task);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-secondary-500 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task._id);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
          <Bug className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No tasks found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {searchQuery ? 'Try adjusting your search or filters' : 'Create your first task to get started'}
          </p>
        </motion.div>
      )}

      {/* Create/Edit Task Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/10 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-gray-700/50 bg-white/10 dark:bg-gray-800/80 backdrop-blur-xl rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    placeholder="Enter task title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
                    placeholder="Enter task description"
                  />
                </div>

                {/* Project and Assignee Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project</label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    >
                      <option value="">Select a project</option>
                      {mockProjects.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Assignee</label>
                    <select
                      value={formData.assigneeId}
                      onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    >
                      <option value="">Select an assignee</option>
                      {mockMembers.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Priority, Due Date, Estimated Hours Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Est. Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 dark:border-gray-700/50">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/10 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-gray-700/50 bg-white/10 dark:bg-gray-800/80 backdrop-blur-xl rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedTask.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selectedTask.projectName}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Task Details */}
              <div className="p-6 space-y-6">
                {/* Status and Priority */}
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(selectedTask.status)}
                  {getPriorityBadge(selectedTask.priority)}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h4>
                  <p className="text-gray-900 dark:text-white">{selectedTask.description}</p>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 dark:bg-gray-700/20 rounded-xl border border-white/10 dark:border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Assignee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-sm font-medium text-white">
                        {selectedTask.assignee?.avatar}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedTask.assignee?.name}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 dark:bg-gray-700/20 rounded-xl border border-white/10 dark:border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Due Date</span>
                    </div>
                    <p className={`text-lg font-medium ${isOverdue(selectedTask.dueDate) ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                      {new Date(selectedTask.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Estimated Hours */}
                <div className="p-4 bg-white/5 dark:bg-gray-700/20 rounded-xl border border-white/10 dark:border-gray-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Hours</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedTask.estimatedHours} hours</p>
                </div>

                {/* Status Change */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Change Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <motion.button
                        key={status.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleStatusChange(selectedTask._id, status.id);
                          setSelectedTask((prev) => ({ ...prev, status: status.id }));
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedTask.status === status.id
                            ? status.color + ' border-2'
                            : 'bg-white/5 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {status.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10 dark:border-gray-700/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(selectedTask);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary-500 hover:bg-secondary-600 rounded-xl text-white font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Task
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleDelete(selectedTask._id);
                      setShowDetailModal(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tasks;
