const Notification = require('../models/Notification');

const notificationController = {
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 50, unreadOnly } = req.query;
      const query = { user: req.user._id };

      if (unreadOnly === 'true') {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

      res.json({
        notifications,
        total,
        unreadCount,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true }
      );

      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      res.json({ message: 'Notification deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = notificationController;