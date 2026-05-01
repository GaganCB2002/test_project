import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  Users,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  PauseCircle,
  ChevronDown,
  Github,
  Code,
  Database,
  Smartphone,
  Globe,
  Layers,
  GitBranch,
  FolderKanban,
  Cloud,
  Box,
} from 'lucide-react';
import {
  addProject,
  updateProject,
  removeProject,
} from '../store/slices/projectSlice';

// Mock team members for avatars
const mockTeamMembers = [
  { id: 1, name: 'Alex Kim', avatar: 'AK' },
  { id: 2, name: 'Sarah Chen', avatar: 'SC' },
  { id: 3, name: 'Mike Johnson', avatar: 'MJ' },
  { id: 4, name: 'Emma Davis', avatar: 'ED' },
  { id: 5, name: 'John Smith', avatar: 'JS' },
];

// Technology options
const techOptions = [
  { name: 'React', icon: Code, color: 'bg-cyan-500' },
  { name: 'Node.js', icon: Github, color: 'bg-green-500' },
  { name: 'Python', icon: Code, color: 'bg-yellow-500' },
  { name: 'PostgreSQL', icon: Database, color: 'bg-blue-500' },
  { name: 'MongoDB', icon: Database, color: 'bg-green-600' },
  { name: 'AWS', icon: Cloud, color: 'bg-orange-500' },
  { name: 'Docker', icon: Box, color: 'bg-blue-600' },
  { name: 'GraphQL', icon: GitBranch, color: 'bg-pink-500' },
  { name: 'Vue.js', icon: Code, color: 'bg-green-500' },
  { name: 'Angular', icon: Layers, color: 'bg-red-500' },
  { name: 'Flutter', icon: Smartphone, color: 'bg-blue-500' },
  { name: 'Go', icon: Code, color: 'bg-cyan-600' },
];

// Helper for tech icon
const TechIcon = ({ name }) => {
  const tech = techOptions.find((t) => t.name === name);
  if (!tech) return <Tag className="w-3 h-3" />;
  const Icon = tech.icon;
  return <Icon className="w-3 h-3" />;
};

// Status badge component
const StatusBadge = ({ status }) => {
  const config = {
    active: { color: 'text-green-500 bg-green-500/10', icon: CheckCircle, label: 'Active' },
    completed: { color: 'text-blue-500 bg-blue-500/10', icon: CheckCircle, label: 'Completed' },
    'on-hold': { color: 'text-yellow-500 bg-yellow-500/10', icon: PauseCircle, label: 'On Hold' },
    pending: { color: 'text-gray-500 bg-gray-500/10', icon: Clock, label: 'Pending' },
  };
  const { color, icon: Icon, label } = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const config = {
    high: { color: 'text-red-500 bg-red-500/10', label: 'High' },
    medium: { color: 'text-yellow-500 bg-yellow-500/10', label: 'Medium' },
    low: { color: 'text-green-500 bg-green-500/10', label: 'Low' },
  };
  const { color, label } = config[priority] || config.medium;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {priority === 'high' && <AlertCircle className="w-3 h-3" />}
      {label}
    </span>
  );
};

// Avatar stack component
const AvatarStack = ({ members, maxVisible = 4 }) => {
  const visible = members.slice(0, maxVisible);
  const remaining = members.length - maxVisible;
  return (
    <div className="flex items-center -space-x-2">
      {visible.map((member, index) => (
        <div
          key={member.id || index}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-[10px] font-medium text-white border-2 border-white dark:border-gray-800"
          title={member.name}
        >
          {member.avatar}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-[10px] font-medium text-white border-2 border-white dark:border-gray-800">
          +{remaining}
        </div>
      )}
    </div>
  );
};

// Initial form state
const initialFormState = {
  name: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  startDate: '',
  endDate: '',
  technologies: [],
  progress: 0,
  teamMembers: mockTeamMembers.slice(0, 3),
};

// Filter tabs
const filterTabs = [
  { id: 'all', label: 'All', count: 0 },
  { id: 'active', label: 'Active', count: 0 },
  { id: 'completed', label: 'Completed', count: 0 },
  { id: 'on-hold', label: 'On Hold', count: 0 },
];

const Projects = () => {
  const dispatch = useDispatch();
  const { items: projects, loading } = useSelector((state) => state.projects);
  const { darkMode } = useSelector((state) => state.theme);

  // Local state
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [showTechDropdown, setShowTechDropdown] = useState(false);

  // Use mock data if no projects in store
  const [projectsData, setProjectsData] = useState([
    {
      _id: '1',
      name: 'E-Commerce Platform Redesign',
      description: 'Complete redesign of the customer-facing e-commerce platform with modern UI/UX and improved performance.',
      status: 'active',
      priority: 'high',
      startDate: '2026-03-01',
      endDate: '2026-06-30',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      progress: 68,
      teamMembers: mockTeamMembers.slice(0, 4),
    },
    {
      _id: '2',
      name: 'Mobile Banking App',
      description: 'Cross-platform mobile banking application with biometric authentication and real-time notifications.',
      status: 'active',
      priority: 'high',
      startDate: '2026-02-15',
      endDate: '2026-08-15',
      technologies: ['Flutter', 'Node.js', 'MongoDB', 'AWS'],
      progress: 45,
      teamMembers: mockTeamMembers.slice(0, 3),
    },
    {
      _id: '3',
      name: 'Analytics Dashboard',
      description: 'Real-time analytics dashboard for business intelligence with customizable widgets and reporting.',
      status: 'completed',
      priority: 'medium',
      startDate: '2025-11-01',
      endDate: '2026-02-28',
      technologies: ['React', 'GraphQL', 'PostgreSQL', 'Docker'],
      progress: 100,
      teamMembers: mockTeamMembers.slice(1, 4),
    },
    {
      _id: '4',
      name: 'API Gateway Implementation',
      description: 'Centralized API gateway with rate limiting, authentication, and monitoring capabilities.',
      status: 'on-hold',
      priority: 'medium',
      startDate: '2026-01-15',
      endDate: '2026-04-15',
      technologies: ['Go', 'Docker', 'AWS'],
      progress: 30,
      teamMembers: mockTeamMembers.slice(0, 2),
    },
    {
      _id: '5',
      name: 'Inventory Management System',
      description: 'Enterprise inventory management system with barcode scanning and warehouse automation.',
      status: 'active',
      priority: 'low',
      startDate: '2026-03-15',
      endDate: '2026-09-30',
      technologies: ['Angular', 'Node.js', 'MongoDB'],
      progress: 22,
      teamMembers: mockTeamMembers.slice(2, 5),
    },
    {
      _id: '6',
      name: 'Customer Portal',
      description: 'Self-service customer portal with order tracking, billing, and support ticket management.',
      status: 'completed',
      priority: 'medium',
      startDate: '2025-09-01',
      endDate: '2026-01-31',
      technologies: ['Vue.js', 'Python', 'PostgreSQL'],
      progress: 100,
      teamMembers: mockTeamMembers.slice(0, 3),
    },
  ]);

  // Update filter counts
  const projectsWithCounts = filterTabs.map((tab) => ({
    ...tab,
    count:
      tab.id === 'all'
        ? projectsData.length
        : projectsData.filter((p) => p.status === tab.id).length,
  }));

  // Filter projects
  const filteredProjects = projectsData.filter((project) => {
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      // Update existing project
      const updated = projectsData.map((p) =>
        p._id === editingProject._id ? { ...formData, _id: editingProject._id } : p
      );
      setProjectsData(updated);
      dispatch(updateProject({ ...formData, _id: editingProject._id }));
    } else {
      // Add new project
      const newProject = {
        ...formData,
        _id: Date.now().toString(),
      };
      setProjectsData([newProject, ...projectsData]);
      dispatch(addProject(newProject));
    }
    closeModal();
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjectsData(projectsData.filter((p) => p._id !== id));
      dispatch(removeProject(id));
    }
  };

  // Open edit modal
  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      technologies: project.technologies,
      progress: project.progress,
      teamMembers: project.teamMembers,
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData(initialFormState);
    setShowTechDropdown(false);
  };

  // Toggle technology
  const toggleTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Page Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your team projects
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Project
        </motion.button>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/10 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/50 overflow-x-auto">
          {projectsWithCounts.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                {/* Priority and Progress */}
                <div className="flex items-center gap-3 mb-4">
                  <PriorityBadge priority={project.priority} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className={`h-full rounded-full ${
                          project.progress === 100
                            ? 'bg-green-500'
                            : project.progress > 50
                            ? 'bg-primary-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300"
                    >
                      <TechIcon name={tech} />
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <span>-</span>
                  <span>{new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-gray-700/50">
                  <AvatarStack members={project.teamMembers} />
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(project)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-secondary-500 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(project._id)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete"
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

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <FolderKanban className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No projects found
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {searchQuery ? 'Try adjusting your search or filters' : 'Create your first project to get started'}
          </p>
        </motion.div>
      )}

      {/* Create/Edit Project Modal */}
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
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    placeholder="Enter project name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
                    placeholder="Enter project description"
                  />
                </div>

                {/* Status and Priority Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Priority
                    </label>
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
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Technologies
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTechDropdown(!showTechDropdown)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-gray-400" />
                        {formData.technologies.length > 0
                          ? `${formData.technologies.length} selected`
                          : 'Select technologies'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTechDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showTechDropdown && (
                      <div className="absolute z-10 w-full mt-2 py-2 bg-white/10 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {techOptions.map((tech) => (
                          <button
                            key={tech.name}
                            type="button"
                            onClick={() => toggleTechnology(tech.name)}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white transition-colors"
                          >
                            <div className={`w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center ${formData.technologies.includes(tech.name) ? 'bg-primary-500 border-primary-500' : ''}`}>
                              {formData.technologies.includes(tech.name) && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm">{tech.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary-500/10 text-primary-500 rounded-full text-xs"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => toggleTechnology(tech)}
                            className="hover:text-primary-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;
