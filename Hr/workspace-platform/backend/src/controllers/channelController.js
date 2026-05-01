const Channel = require('../models/Channel');
const Message = require('../models/Message');

const channelController = {
  create: async (req, res) => {
    try {
      const { name, description, isPrivate, memberIds } = req.body;
      const workspaceId = req.params.workspaceId;

      const channel = new Channel({
        name,
        description,
        workspace: workspaceId,
        type: 'channel',
        isPrivate: isPrivate || false,
        createdBy: req.user._id,
        members: memberIds ? [...memberIds, req.user._id] : [req.user._id]
      });

      await channel.save();
      res.status(201).json(channel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getWorkspaceChannels: async (req, res) => {
    try {
      const channels = await Channel.find({
        workspace: req.params.workspaceId,
        $or: [
          { isPrivate: false },
          { members: req.user._id }
        ]
      })
        .populate('createdBy', 'firstName lastName avatar')
        .sort({ type: 1, name: 1 });

      res.json(channels);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getChannel: async (req, res) => {
    try {
      const channel = await Channel.findById(req.params.id)
        .populate('members', 'firstName lastName avatar email');

      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }

      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { name, description } = req.body;
      const channel = req.channel;

      if (name) channel.name = name;
      if (description !== undefined) channel.description = description;

      await channel.save();
      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addMembers: async (req, res) => {
    try {
      const { memberIds } = req.body;
      const channel = req.channel;

      memberIds.forEach(memberId => {
        if (!channel.members.includes(memberId)) {
          channel.members.push(memberId);
        }
      });

      await channel.save();
      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createDirectMessage: async (req, res) => {
    try {
      const { recipientId } = req.body;
      const workspaceId = req.params.workspaceId;

      let channel = await Channel.findOne({
        workspace: workspaceId,
        type: 'direct',
        members: { $all: [req.user._id, recipientId] }
      });

      if (!channel) {
        channel = new Channel({
          name: 'direct',
          workspace: workspaceId,
          type: 'direct',
          members: [req.user._id, recipientId],
          createdBy: req.user._id
        });
        await channel.save();
      }

      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.query;
      const channelId = req.params.id;

      const messages = await Message.find({
        channel: channelId,
        isDeleted: false
      })
        .populate('sender', 'firstName lastName avatar')
        .populate('reactions.user', 'firstName lastName')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Message.countDocuments({ channel: channelId, isDeleted: false });

      res.json({
        messages,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { content, mentions, replyTo, attachments } = req.body;
      const channelId = req.params.id;

      const message = new Message({
        content,
        sender: req.user._id,
        channel: channelId,
        workspace: req.params.workspaceId,
        mentions,
        replyTo,
        attachments
      });

      await message.save();

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'firstName lastName avatar');

      res.status(201).json(populatedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Channel.findByIdAndDelete(req.params.id);
      res.json({ message: 'Channel deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = channelController;