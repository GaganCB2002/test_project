import { ActivityLog } from '../models/index.js';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private (Admin, Manager, TechLead)
export const getActivities = async (req, res) => {
  try {
    const { action, entityType, page = 1, limit = 100 } = req.query;

    const query = {};

    if (action) {
      query.action = { $regex: action, $options: 'i' };
    }

    if (entityType) {
      query.entityType = entityType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await ActivityLog.find(query)
      .populate('user', 'name email avatar role')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        activities,
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
      message: error.message || 'Server error fetching activities'
    });
  }
};

// @desc    Get single activity by ID
// @route   GET /api/activities/:id
// @access  Private
export const getActivityById = async (req, res) => {
  try {
    const activity = await ActivityLog.findById(req.params.id)
      .populate('user', 'name email avatar role');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching activity'
    });
  }
};

// @desc    Get activities by user
// @route   GET /api/activities/user/:userId
// @access  Private
export const getUserActivities = async (req, res) => {
  try {
    const { action, entityType, page = 1, limit = 50 } = req.query;

    const query = { user: req.params.userId };

    if (action) {
      query.action = { $regex: action, $options: 'i' };
    }

    if (entityType) {
      query.entityType = entityType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await ActivityLog.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        activities,
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
      message: error.message || 'Server error fetching user activities'
    });
  }
};

// @desc    Get activities by entity
// @route   GET /api/activities/entity/:entityType/:entityId
// @access  Private
export const getEntityActivities = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { action, page = 1, limit = 50 } = req.query;

    const query = {
      entityType,
      entityId
    };

    if (action) {
      query.action = { $regex: action, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await ActivityLog.find(query)
      .populate('user', 'name email avatar role')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        activities,
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
      message: error.message || 'Server error fetching entity activities'
    });
  }
};

// @desc    Create activity log
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res) => {
  try {
    const { action, entityType, entityId, description, metadata } = req.body;

    if (!action || !entityType || !entityId) {
      return res.status(400).json({
        success: false,
        message: 'Action, entityType, and entityId are required'
      });
    }

    const activity = await ActivityLog.create({
      user: req.user.userId,
      action,
      entityType,
      entityId,
      description: description || '',
      metadata: metadata || {}
    });

    const populatedActivity = await ActivityLog.findById(activity._id)
      .populate('user', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: populatedActivity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating activity'
    });
  }
};

// @desc    Get recent activities (last 24 hours)
// @route   GET /api/activities/recent
// @access  Private
export const getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const activities = await ActivityLog.find({
      createdAt: { $gte: twentyFourHoursAgo }
    })
      .populate('user', 'name email avatar role')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching recent activities'
    });
  }
};

// @desc    Get activities by date range
// @route   GET /api/activities/range
// @access  Private
export const getActivitiesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, user, entityType, page = 1, limit = 50 } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    if (user) {
      query.user = user;
    }

    if (entityType) {
      query.entityType = entityType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await ActivityLog.find(query)
      .populate('user', 'name email avatar role')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        activities,
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
      message: error.message || 'Server error fetching activities by date range'
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private (Admin only)
export const deleteActivity = async (req, res) => {
  try {
    const activity = await ActivityLog.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    await ActivityLog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting activity'
    });
  }
};

// @desc    Delete activities by entity
// @route   DELETE /api/activities/entity/:entityType/:entityId
// @access  Private (Admin only)
export const deleteEntityActivities = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const result = await ActivityLog.deleteMany({
      entityType,
      entityId
    });

    res.json({
      success: true,
      message: 'Entity activities deleted successfully',
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting entity activities'
    });
  }
};

export default {
  getActivities,
  getActivityById,
  getUserActivities,
  getEntityActivities,
  createActivity,
  getRecentActivities,
  getActivitiesByDateRange,
  deleteActivity,
  deleteEntityActivities
};
