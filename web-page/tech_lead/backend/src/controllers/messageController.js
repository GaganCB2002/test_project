import { Message, User } from '../models/index.js';

// @desc    Get messages by room
// @route   GET /api/messages/room/:room
// @access  Private
export const getMessagesByRoom = async (req, res) => {
  try {
    const { room } = req.params;
    const { page = 1, limit = 50, before } = req.query;

    const query = { room };

    // For pagination - get messages before a certain date
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find(query)
      .populate('sender', 'name email avatar role')
      .populate('attachments', 'filename originalName mimeType size')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); // Sort by newest first for pagination

    // Reverse to show oldest first in response
    messages.reverse();

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      data: {
        messages,
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
      message: error.message || 'Server error fetching messages'
    });
  }
};

// @desc    Create new message
// @route   POST /api/messages
// @access  Private
export const createMessage = async (req, res) => {
  try {
    const { content, room, attachments } = req.body;

    if (!content || !room) {
      return res.status(400).json({
        success: false,
        message: 'Content and room are required'
      });
    }

    const message = await Message.create({
      sender: req.user.userId,
      content,
      room,
      attachments: attachments || [],
      isRead: false
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar role')
      .populate('attachments', 'filename originalName mimeType size path');

    // Emit socket event for real-time update
    if (req.io) {
      req.io.to(room).emit('receive_message', populatedMessage);
    }

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating message'
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isRead = true;
    await message.save();

    const updatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar role');

    res.json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error marking message as read'
    });
  }
};

// @desc    Mark multiple messages as read
// @route   PUT /api/messages/read-many
// @access  Private
export const markManyAsRead = async (req, res) => {
  try {
    const { messageIds, room } = req.body;

    if (!messageIds && !room) {
      return res.status(400).json({
        success: false,
        message: 'Message IDs or room is required'
      });
    }

    const query = { isRead: false };

    if (messageIds && messageIds.length > 0) {
      query._id = { $in: messageIds };
    } else if (room) {
      query.room = room;
    }

    await Message.updateMany(query, { isRead: true });

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error marking messages as read'
    });
  }
};

// @desc    Get unread message count for a user
// @route   GET /api/messages/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const { room } = req.query;

    const query = { isRead: false };

    // If room is specified, only count messages in that room
    if (room) {
      query.room = room;
    }

    const count = await Message.countDocuments(query);

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

// @desc    Get user's message history
// @route   GET /api/messages/history
// @access  Private
export const getUserMessageHistory = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get distinct rooms the user has participated in
    const messages = await Message.find({ sender: req.user.userId })
      .populate('sender', 'name email avatar role')
      .populate('attachments', 'filename originalName mimeType size')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Message.countDocuments({ sender: req.user.userId });

    res.json({
      success: true,
      data: {
        messages,
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
      message: error.message || 'Server error fetching message history'
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin, Manager, TechLead, or sender)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is sender or has admin privileges
    const user = await User.findById(req.user.userId);
    if (
      message.sender.toString() !== req.user.userId &&
      !['Admin', 'Manager', 'TechLead'].includes(user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting message'
    });
  }
};

export default {
  getMessagesByRoom,
  createMessage,
  markAsRead,
  markManyAsRead,
  getUnreadCount,
  getUserMessageHistory,
  deleteMessage
};
