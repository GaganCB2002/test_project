import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /:room - Get messages for a room
router.get('/:room', auth, async (req, res) => {
  try {
    const { room } = req.params;
    const { limit = 50, before } = req.query;

    // TODO: Get messages
    // const query = { room };
    // if (before) query.createdAt = { $lt: new Date(before) };
    // const messages = await Message.find(query)
    //   .sort({ createdAt: -1 })
    //   .limit(parseInt(limit))
    //   .populate('sender', 'name email');

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST / - Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { room, content, recipientId } = req.body;

    if (!room || !content) {
      return res.status(400).json({ success: false, message: 'Room and content are required' });
    }

    // TODO: Create message
    // const message = await Message.create({
    //   room,
    //   content,
    //   sender: req.user.id,
    //   recipientId
    // });

    res.status(201).json({
      success: true,
      data: { id: 'message._id', room, content, sender: req.user.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /:id/read - Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    // TODO: Mark message as read
    // const message = await Message.findByIdAndUpdate(
    //   req.params.id,
    //   { readAt: new Date() },
    //   { new: true }
    // );

    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /:room/unread-count - Get unread count for a room
router.get('/:room/unread-count', auth, async (req, res) => {
  try {
    const { room } = req.params;

    // TODO: Count unread messages
    // const count = await Message.countDocuments({
    //   room,
    //   recipientId: req.user.id,
    //   readAt: null
    // });

    res.json({ success: true, data: { room, unreadCount: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;