import { TimeTracking, Task, Project, User } from '../models/index.js';

// @desc    Get all time tracking entries
// @route   GET /api/time-tracking
// @access  Private (Admin, Manager, TechLead)
export const getAllTimeEntries = async (req, res) => {
  try {
    const { project, task, user, startDate, endDate, page = 1, limit = 50 } = req.query;

    const query = {};

    if (project) {
      query.project = project;
    }

    if (task) {
      query.task = task;
    }

    if (user) {
      query.user = user;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const entries = await TimeTracking.find(query)
      .populate('user', 'name email avatar role')
      .populate('task', 'title status')
      .populate('project', 'name status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await TimeTracking.countDocuments(query);

    // Calculate total duration for this query
    const totalDuration = await TimeTracking.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        totalDuration: totalDuration[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching time entries'
    });
  }
};

// @desc    Get single time tracking entry by ID
// @route   GET /api/time-tracking/:id
// @access  Private
export const getTimeEntryById = async (req, res) => {
  try {
    const entry = await TimeTracking.findById(req.params.id)
      .populate('user', 'name email avatar role')
      .populate('task', 'title status priority')
      .populate('project', 'name status');

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching time entry'
    });
  }
};

// @desc    Create time tracking entry
// @route   POST /api/time-tracking
// @access  Private
export const createTimeEntry = async (req, res) => {
  try {
    const { task, project, duration, date, description } = req.body;

    if (!duration || !project) {
      return res.status(400).json({
        success: false,
        message: 'Duration and project are required'
      });
    }

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(400).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify task exists if provided
    if (task) {
      const taskExists = await Task.findById(task);
      if (!taskExists) {
        return res.status(400).json({
          success: false,
          message: 'Task not found'
        });
      }
    }

    const entry = await TimeTracking.create({
      user: req.user.userId,
      task: task || null,
      project,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date(),
      description: description || ''
    });

    // Update task's logged hours if linked to task
    if (task) {
      await Task.findByIdAndUpdate(task, {
        $inc: { loggedHours: parseInt(duration) }
      });
    }

    const populatedEntry = await TimeTracking.findById(entry._id)
      .populate('user', 'name email avatar role')
      .populate('task', 'title status')
      .populate('project', 'name status');

    res.status(201).json({
      success: true,
      data: populatedEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating time entry'
    });
  }
};

// @desc    Update time tracking entry
// @route   PUT /api/time-tracking/:id
// @access  Private (Admin, Manager, TechLead, or owner)
export const updateTimeEntry = async (req, res) => {
  try {
    const { duration, date, description, task } = req.body;

    let entry = await TimeTracking.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    // Check if user is owner or has admin privileges
    const user = await User.findById(req.user.userId);
    if (
      entry.user.toString() !== req.user.userId &&
      !['Admin', 'Manager', 'TechLead'].includes(user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this time entry'
      });
    }

    const oldDuration = entry.duration;

    // Update fields
    if (duration) entry.duration = parseInt(duration);
    if (date) entry.date = new Date(date);
    if (description !== undefined) entry.description = description;
    if (task !== undefined) entry.task = task || null;

    await entry.save();

    // Update task's logged hours if duration changed and linked to task
    if (task && duration && duration !== oldDuration) {
      const durationDiff = duration - oldDuration;
      await Task.findByIdAndUpdate(task, {
        $inc: { loggedHours: durationDiff }
      });
    }

    const updatedEntry = await TimeTracking.findById(entry._id)
      .populate('user', 'name email avatar role')
      .populate('task', 'title status')
      .populate('project', 'name status');

    res.json({
      success: true,
      data: updatedEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating time entry'
    });
  }
};

// @desc    Delete time tracking entry
// @route   DELETE /api/time-tracking/:id
// @access  Private (Admin, Manager, TechLead, or owner)
export const deleteTimeEntry = async (req, res) => {
  try {
    const entry = await TimeTracking.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    // Check if user is owner or has admin privileges
    const user = await User.findById(req.user.userId);
    if (
      entry.user.toString() !== req.user.userId &&
      !['Admin', 'Manager', 'TechLead'].includes(user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this time entry'
      });
    }

    // Update task's logged hours if linked to task
    if (entry.task) {
      await Task.findByIdAndUpdate(entry.task, {
        $inc: { loggedHours: -entry.duration }
      });
    }

    await TimeTracking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Time entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting time entry'
    });
  }
};

// @desc    Get time entries for current user
// @route   GET /api/time-tracking/my-entries
// @access  Private
export const getUserTimeEntries = async (req, res) => {
  try {
    const { project, task, startDate, endDate, page = 1, limit = 50 } = req.query;

    const query = { user: req.user.userId };

    if (project) {
      query.project = project;
    }

    if (task) {
      query.task = task;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const entries = await TimeTracking.find(query)
      .populate('task', 'title status')
      .populate('project', 'name status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await TimeTracking.countDocuments(query);

    // Calculate total duration for this user
    const totalDuration = await TimeTracking.aggregate([
      { $match: { user: entry[0]?.user || req.user.userId } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        totalDuration: totalDuration[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user time entries'
    });
  }
};

// @desc    Get time entries for a task
// @route   GET /api/time-tracking/task/:taskId
// @access  Private
export const getTaskTimeEntries = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const entries = await TimeTracking.find({ task: req.params.taskId })
      .populate('user', 'name email avatar role')
      .populate('project', 'name status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await TimeTracking.countDocuments({ task: req.params.taskId });

    // Calculate total duration for this task
    const totalDuration = await TimeTracking.aggregate([
      { $match: { task: req.params.taskId } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        totalDuration: totalDuration[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching task time entries'
    });
  }
};

// @desc    Get time entries for a project
// @route   GET /api/time-tracking/project/:projectId
// @access  Private
export const getProjectTimeEntries = async (req, res) => {
  try {
    const { user, startDate, endDate, page = 1, limit = 50 } = req.query;

    const query = { project: req.params.projectId };

    if (user) {
      query.user = user;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const entries = await TimeTracking.find(query)
      .populate('user', 'name email avatar role')
      .populate('task', 'title status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await TimeTracking.countDocuments(query);

    // Calculate total duration for this project
    const totalDuration = await TimeTracking.aggregate([
      { $match: { project: req.params.projectId } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    // Get duration breakdown by user
    const durationByUser = await TimeTracking.aggregate([
      { $match: { project: req.params.projectId } },
      { $group: { _id: '$user', total: { $sum: '$duration' } } },
      { $sort: { total: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        totalDuration: totalDuration[0]?.total || 0,
        durationByUser
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching project time entries'
    });
  }
};

// @desc    Get time summary for current user
// @route   GET /api/time-tracking/summary
// @access  Private
export const getTimeSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = { user: req.user.userId };

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) {
        matchStage.date.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.date.$lte = new Date(endDate);
      }
    }

    // Total hours
    const totalResult = await TimeTracking.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: '$duration' }, count: { $sum: 1 } } }
    ]);

    // Hours by project
    const byProject = await TimeTracking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$project',
          total: { $sum: '$duration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Hours by task
    const byTask = await TimeTracking.aggregate([
      { $match: { ...matchStage, task: { $ne: null } } },
      {
        $group: {
          _id: '$task',
          total: { $sum: '$duration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Hours by date (daily)
    const byDate = await TimeTracking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          total: { $sum: '$duration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalResult[0]?.total || 0,
        entryCount: totalResult[0]?.count || 0,
        byProject,
        byTask,
        byDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching time summary'
    });
  }
};

export default {
  getAllTimeEntries,
  getTimeEntryById,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  getUserTimeEntries,
  getTaskTimeEntries,
  getProjectTimeEntries,
  getTimeSummary
};
