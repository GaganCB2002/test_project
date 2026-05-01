import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET / - List all notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;

    // TODO: Build query
    // const query = { recipientId: req.user.id };
    // if (unreadOnly === 'true') query.readAt = null;
    //
    // const notifications = await Notification.find(query)
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(parseInt(limit))
    //   .populate('sender', 'name');

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /:id/read - Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    // TODO: Mark notification as read
    // const notification = await Notification.findOneAndUpdate(
    //   { _id: req.params.id, recipientId: req.user.id },
    //   { readAt: new Date() },
    //   { new: true }
    // );

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /read-all - Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    // TODO: Mark all as read
    // await Notification.updateMany(
    //   { recipientId: req.user.id, readAt: null },
    //   { readAt: new Date() }
    // );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /:id - Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    // TODO: Delete notification
    // await Notification.findOneAndDelete({ _id: req.params.id, recipientId: req.user.id });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /unread-count - Get unread notification count
router.get('/unread-count', auth, async (req, res) => {
  try {
    // TODO: Count unread
    // const count = await Notification.countDocuments({
    //   recipientId: req.user.id,
    //   readAt: null
    // });

    res.json({ success: true, data: { unreadCount: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;