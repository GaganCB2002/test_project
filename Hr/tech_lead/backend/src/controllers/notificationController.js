import { Notification } from '../models/index.js';

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const { type, isRead, page = 1, limit = 50 } = req.query;

    const query = { user: req.user.userId };

    if (type) {
      query.type = type;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: {
        notifications,
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
      message: error.message || 'Server error fetching notifications'
    });
  }
};

// @desc    Get single notification by ID
// @route   GET /api/notifications/:id
// @access  Private
export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if notification belongs to current user
    if (notification.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this notification'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching notification'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if notification belongs to current user
    if (notification.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error marking notification as read'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error marking notifications as read'
    });
  }
};

// @desc    Delete single notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if notification belongs to current user
    if (notification.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting notification'
    });
  }
};

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/read
// @access  Private
export const deleteReadNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      user: req.user.userId,
      isRead: true
    });

    res.json({
      success: true,
      message: 'Read notifications deleted successfully',
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting notifications'
    });
  }
};

// @desc    Delete all notifications
// @route   DELETE /api/notifications/all
// @access  Private
export const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      user: req.user.userId
    });

    res.json({
      success: true,
      message: 'All notifications deleted successfully',
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting notifications'
    });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.userId,
      isRead: false
    });

    res.json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error getting unread count'
    });
  }
};

// @desc    Create notification (internal use)
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (req, res) => {
  try {
    const { user, title, message, type } = req.body;

    if (!user || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'User, title, and message are required'
      });
    }

    const notification = await Notification.create({
      user,
      title,
      message,
      type: type || 'System',
      isRead: false
    });

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.emit('new_notification', notification);
    }

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating notification'
    });
  }
};

export default {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  deleteAllNotifications,
  getUnreadCount,
  createNotification
};
