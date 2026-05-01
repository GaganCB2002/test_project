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
  Clock,
  CheckCircle,
  PauseCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  GripVertical,
  Play,
  Pause,
  Settings,
  GitBranch,
  Layers,
  Zap,
} from 'lucide-react';

// Mock workflow data
const mockWorkflows = [
  {
    _id: '1',
    name: 'Development Workflow',
    description: 'Standard development process from planning to deployment',
    projectId: '1',
    projectName: 'E-Commerce Platform',
    steps: [
      { id: 1, name: 'Requirements', status: 'completed', order: 1 },
      { id: 2, name: 'Design', status: 'completed', order: 2 },
      { id: 3, name: 'Development', status: 'in-progress', order: 3 },
      { id: 4, name: 'Code Review', status: 'pending', order: 4 },
      { id: 5, name: 'Testing', status: 'pending', order: 5 },
      { id: 6, name: 'Deployment', status: 'pending', order: 6 },
    ],
    createdAt: '2026-03-01',
  },
  {
    _id: '2',
    name: 'Bug Fix Workflow',
    description: 'Process for handling and resolving bug reports',
    projectId: '2',
    projectName: 'Mobile Banking App',
    steps: [
      { id: 1, name: 'Bug Report', status: 'completed', order: 1 },
      { id: 2, name: 'Investigation', status: 'completed', order: 2 },
      { id: 3, name: 'Fix Implementation', status: 'in-progress', order: 3 },
      { id: 4, name: 'Testing', status: 'pending', order: 4 },
      { id: 5, name: 'Release', status: 'pending', order: 5 },
    ],
    createdAt: '2026-03-15',
  },
  {
    _id: '3',
    name: 'Feature Approval',
    description: 'Workflow for new feature development and approval',
    projectId: '1',
    projectName: 'E-Commerce Platform',
    steps: [
      { id: 1, name: 'Feature Request', status: 'pending', order: 1 },
      { id: 2, name: 'Review', status: 'pending', order: 2 },
      { id: 3, name: 'Implementation', status: 'pending', order: 3 },
      { id: 4, name: 'QA', status: 'pending', order: 4 },
      { id: 5, name: 'Stakeholder Approval', status: 'pending', order: 5 },
    ],
    createdAt: '2026-04-01',
  },
  {
    _id: '4',
    name: 'Code Review Pipeline',
    description: 'Automated code review and quality gates',
    projectId: '3',
    projectName: 'Analytics Dashboard',
    steps: [
      { id: 1, name: 'PR Creation', status: 'completed', order: 1 },
      { id: 2, name: 'Linting', status: 'completed', order: 2 },
      { id: 3, name: 'Unit Tests', status: 'in-progress', order: 3 },
      { id: 4, name: 'Integration Tests', status: 'pending', order: 4 },
      { id: 5, name: 'Merge', status: 'pending', order: 5 },
    ],
    createdAt: '2026-04-10',
  },
];

const statusConfig = {
  pending: { color: 'bg-gray-500/20 text-gray-500 border-gray-500', icon: Clock },
  'in-progress': { color: 'bg-blue-500/20 text-blue-500 border-blue-500', icon: Play },
  completed: { color: 'bg-green-500/20 text-green-500 border-green-500', icon: CheckCircle },
};

const Workflow = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { items: projects } = useSelector((state) => state.projects);

  const [workflowsData, setWorkflowsData] = useState(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: '',
    steps: [],
  });

  const [newStepName, setNewStepName] = useState('');

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

  const getWorkflowProgress = (workflow) => {
    if (!workflow.steps.length) return 0;
    const completed = workflow.steps.filter((s) => s.status === 'completed').length;
    return Math.round((completed / workflow.steps.length) * 100);
  };

  const calculateProgress = (steps) => {
    if (!steps.length) return 0;
    const completed = steps.filter((s) => s.status === 'completed').length;
    return Math.round((completed / steps.length) * 100);
  };

  const filteredWorkflows = workflowsData.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingWorkflow) {
      const updated = workflowsData.map((w) =>
        w._id === editingWorkflow._id ? { ...formData, _id: editingWorkflow._id, createdAt: editingWorkflow.createdAt } : w
      );
      setWorkflowsData(updated);
    } else {
      const newWorkflow = {
        ...formData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        projectName: projects.find((p) => p._id === formData.projectId)?.name || 'No Project',
      };
      setWorkflowsData([newWorkflow, ...workflowsData]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      setWorkflowsData(workflowsData.filter((w) => w._id !== id));
    }
  };

  const openEditModal = (workflow) => {
    setEditingWorkflow(workflow);
    setFormData({
      name: workflow.name,
      description: workflow.description,
      projectId: workflow.projectId,
      steps: [...workflow.steps],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingWorkflow(null);
    setFormData({ name: '', description: '', projectId: '', steps: [] });
    setNewStepName('');
  };

  const openDetailModal = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowDetailModal(true);
  };

  const addStep = () => {
    if (newStepName.trim()) {
      const newStep = {
        id: Date.now(),
        name: newStepName,
        status: 'pending',
        order: formData.steps.length + 1,
      };
      setFormData((prev) => ({
        ...prev,
        steps: [...prev.steps, newStep],
      }));
      setNewStepName('');
    }
  };

  const removeStep = (stepId) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps
        .filter((s) => s.id !== stepId)
        .map((s, idx) => ({ ...s, order: idx + 1 })),
    }));
  };

  const moveStep = (stepId, direction) => {
    setFormData((prev) => {
      const steps = [...prev.steps];
      const index = steps.findIndex((s) => s.id === stepId);
      if (direction === 'up' && index > 0) {
        [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
      } else if (direction === 'down' && index < steps.length - 1) {
        [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
      }
      return { ...prev, steps: steps.map((s, idx) => ({ ...s, order: idx + 1 })) };
    });
  };

  const updateStepStatus = (stepId, status) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === stepId ? { ...s, status } : s)),
    }));
  };

  const toggleStepExpand = (stepId) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workflow</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Design and manage workflow processes
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Workflow
        </motion.button>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
        />
      </motion.div>

      {/* Workflows Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredWorkflows.map((workflow, index) => {
            const progress = getWorkflowProgress(workflow);
            return (
              <motion.div
                key={workflow._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden cursor-pointer"
                onClick={() => openDetailModal(workflow)}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {workflow.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {workflow.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(workflow);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-secondary-500 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(workflow._id);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Project Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-500/10 text-secondary-500 rounded-full text-xs font-medium">
                      <Layers className="w-3.5 h-3.5" />
                      {workflow.projectName}
                    </span>
                  </div>

                  {/* Step Count and Progress */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <GitBranch className="w-4 h-4" />
                      <span>{workflow.steps.length} steps</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className={`h-full rounded-full ${
                            progress === 100
                              ? 'bg-green-500'
                              : progress > 50
                              ? 'bg-primary-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Steps Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {workflow.steps.slice(0, 4).map((step) => {
                      const config = statusConfig[step.status];
                      return (
                        <span
                          key={step.id}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 ${config.color} rounded-full text-xs`}
                        >
                          {step.name}
                        </span>
                      );
                    })}
                    {workflow.steps.length > 4 && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-gray-500/10 text-gray-500 rounded-full text-xs">
                        +{workflow.steps.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-gray-700/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created {new Date(workflow.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-1 text-primary-500">
                      <span className="text-xs font-medium">View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
          <GitBranch className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No workflows found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {searchQuery ? 'Try adjusting your search' : 'Create your first workflow to get started'}
          </p>
        </motion.div>
      )}

      {/* Create/Edit Workflow Modal */}
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
                  {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
                </h2>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Workflow Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    placeholder="Enter workflow name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
                    placeholder="Enter workflow description"
                  />
                </div>

                {/* Project Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Project
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  >
                    <option value="">Select a project</option>
                    <option value="1">E-Commerce Platform</option>
                    <option value="2">Mobile Banking App</option>
                    <option value="3">Analytics Dashboard</option>
                  </select>
                </div>

                {/* Steps Builder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Steps
                  </label>
                  <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
                    {formData.steps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-3 bg-white/5 dark:bg-gray-700/20 rounded-xl border border-white/10 dark:border-gray-600/30"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                        <span className="flex-1 text-sm text-gray-900 dark:text-white">{step.name}</span>
                        <select
                          value={step.status}
                          onChange={(e) => updateStepStatus(step.id, e.target.value)}
                          className="px-2 py-1 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <div className="flex items-center gap-1">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => moveStep(step.id, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => moveStep(step.id, 'down')}
                            disabled={index === formData.steps.length - 1}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeStep(step.id)}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStepName}
                      onChange={(e) => setNewStepName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
                      placeholder="Add a step..."
                      className="flex-1 px-4 py-2 bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addStep}
                      className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 rounded-xl text-white text-sm font-medium transition-colors"
                    >
                      Add Step
                    </motion.button>
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
                    {editingWorkflow ? 'Update Workflow' : 'Create Workflow'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedWorkflow && (
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
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/10 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-gray-700/50 bg-white/10 dark:bg-gray-800/80 backdrop-blur-xl rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedWorkflow.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selectedWorkflow.description}</p>
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

              {/* Steps Flowchart */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Workflow Steps</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Progress: {calculateProgress(selectedWorkflow.steps)}%</span>
                  </div>
                </div>

                <div className="relative">
                  {/* Connection Lines */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-secondary-500 to-green-500" />

                  {/* Steps */}
                  <div className="space-y-4 relative z-10">
                    {selectedWorkflow.steps.map((step, index) => {
                      const config = statusConfig[step.status];
                      const StatusIcon = config.icon;
                      const isExpanded = expandedStepId === step.id;
                      const isLast = index === selectedWorkflow.steps.length - 1;

                      return (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          <div className="flex items-center gap-4">
                            {/* Step Circle */}
                            <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center border-2 border-current`}>
                              <StatusIcon className="w-5 h-5" />
                            </div>

                            {/* Step Card */}
                            <div className="flex-1 backdrop-blur-xl bg-white/10 dark:bg-gray-800/50 rounded-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                              <div
                                className="flex items-center justify-between p-4 cursor-pointer"
                                onClick={() => toggleStepExpand(step.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{step.order}</span>
                                  <span className="text-base font-medium text-gray-900 dark:text-white">{step.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.color} rounded-full text-xs font-medium`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {step.status.replace('-', ' ')}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>

                              {/* Expanded Content */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 pb-4 border-t border-white/10 dark:border-gray-700/50"
                                  >
                                    <div className="pt-4 space-y-3">
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        This step is currently <span className="font-medium">{step.status.replace('-', ' ')}</span>
                                      </p>
                                      <div className="flex items-center gap-4">
                                        <button
                                          onClick={() => updateStepStatusInDetail(step.id, 'pending')}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            step.status === 'pending'
                                              ? 'bg-gray-500 text-white'
                                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                          }`}
                                        >
                                          Pending
                                        </button>
                                        <button
                                          onClick={() => updateStepStatusInDetail(step.id, 'in-progress')}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            step.status === 'in-progress'
                                              ? 'bg-blue-500 text-white'
                                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                          }`}
                                        >
                                          In Progress
                                        </button>
                                        <button
                                          onClick={() => updateStepStatusInDetail(step.id, 'completed')}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            step.status === 'completed'
                                              ? 'bg-green-500 text-white'
                                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                          }`}
                                        >
                                          Completed
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Mini Preview */}
                <div className="mt-8 p-4 bg-white/5 dark:bg-gray-700/20 rounded-xl border border-white/10 dark:border-gray-600/30">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Preview</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflow.steps.map((step) => {
                      const config = statusConfig[step.status];
                      return (
                        <span key={step.id} className={`inline-flex items-center gap-1 px-3 py-1.5 ${config.color} rounded-lg text-xs font-medium`}>
                          <Zap className="w-3 h-3" />
                          {step.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Workflow;
