import { Task, Project, User } from '../models/index.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, project, assignedTo, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (project) {
      query.project = project;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .populate('project', 'name status')
      .populate('assignedTo', 'name email avatar role')
      .populate('assignedBy', 'name email avatar role')
      .populate('attachments', 'filename originalName mimeType')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching tasks'
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name status description')
      .populate('assignedTo', 'name email avatar role department')
      .populate('assignedBy', 'name email avatar role')
      .populate('attachments', 'filename originalName mimeType size path')
      .populate('dependencies', 'title status priority');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching task'
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin, Manager, TechLead)
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      assignedBy,
      status,
      priority,
      dueDate,
      estimatedHours,
      attachments,
      dependencies,
      labels
    } = req.body;

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(400).json({
        success: false,
        message: 'Project not found'
      });
    }

    // If assignedTo is provided, verify user exists
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user not found'
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      assignedBy: assignedBy || req.user.userId,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      estimatedHours,
      attachments: attachments || [],
      dependencies: dependencies || [],
      labels: labels || []
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name status')
      .populate('assignedTo', 'name email avatar role')
      .populate('assignedBy', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating task'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedHours,
      attachments,
      dependencies,
      labels
    } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
    if (attachments !== undefined) task.attachments = attachments;
    if (dependencies !== undefined) task.dependencies = dependencies;
    if (labels !== undefined) task.labels = labels;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name status')
      .populate('assignedTo', 'name email avatar role')
      .populate('assignedBy', 'name email avatar role')
      .populate('attachments', 'filename originalName mimeType');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating task'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin, Manager, TechLead)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting task'
    });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Todo', 'In Progress', 'Review', 'Testing', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name status')
      .populate('assignedTo', 'name email avatar role')
      .populate('assignedBy', 'name email avatar role');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating task status'
    });
  }
};

// @desc    Assign task to user
// @route   PUT /api/tasks/:id/assign
// @access  Private (Admin, Manager, TechLead)
export const assignTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // If assignedTo is provided, verify user exists
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user not found'
        });
      }
    }

    task.assignedTo = assignedTo || null;
    task.assignedBy = req.user.userId;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name status')
      .populate('assignedTo', 'name email avatar role department')
      .populate('assignedBy', 'name email avatar role');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error assigning task'
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.comments.push({
      user: req.user.userId,
      content,
      createdAt: new Date()
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name email avatar')
      .populate('project', 'name status')
      .populate('assignedTo', 'name email avatar role')
      .populate('assignedBy', 'name email avatar role');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding comment'
    });
  }
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateStatus,
  assignTask,
  addComment
};
