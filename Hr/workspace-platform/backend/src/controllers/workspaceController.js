const Workspace = require('../models/Workspace');
const Channel = require('../models/Channel');

const workspaceController = {
  create: async (req, res) => {
    try {
      const { name, description, type } = req.body;

      const workspace = new Workspace({
        name,
        description,
        type: type || 'public',
        organization: req.user.organization,
        createdBy: req.user._id,
        members: [{ user: req.user._id, role: 'Admin' }]
      });

      await workspace.save();

      const generalChannel = new Channel({
        name: 'general',
        description: 'General discussions',
        workspace: workspace._id,
        type: 'channel',
        members: [req.user._id],
        createdBy: req.user._id
      });

      await generalChannel.save();

      workspace.channels.push(generalChannel._id);
      await workspace.save();

      req.user.workspaces.push(workspace._id);
      await req.user.save();

      res.status(201).json(workspace);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const workspaces = await Workspace.find({
        'members.user': req.user._id,
        isActive: true
      }).populate('organization', 'name slug logo')
        .populate('members.user', 'firstName lastName email avatar role');

      res.json(workspaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const workspace = await Workspace.findById(req.params.id)
        .populate('organization')
        .populate('members.user', 'firstName lastName email avatar role department')
        .populate('channels');

      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }

      res.json(workspace);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { name, description, type, settings } = req.body;
      const workspace = req.workspace;

      if (name) workspace.name = name;
      if (description) workspace.description = description;
      if (type) workspace.type = type;
      if (settings) workspace.settings = { ...workspace.settings, ...settings };

      await workspace.save();
      res.json(workspace);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addMember: async (req, res) => {
    try {
      const { userId, role } = req.body;
      const workspace = req.workspace;

      const existingMember = workspace.members.find(
        m => m.user.toString() === userId
      );

      if (existingMember) {
        return res.status(400).json({ message: 'User is already a member' });
      }

      workspace.members.push({ user: userId, role: role || 'Member' });
      await workspace.save();

      const user = await User.findById(userId);
      if (user && !user.workspaces.includes(workspace._id)) {
        user.workspaces.push(workspace._id);
        await user.save();
      }

      res.json(workspace);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeMember: async (req, res) => {
    try {
      const { userId } = req.params;
      const workspace = req.workspace;

      workspace.members = workspace.members.filter(
        m => m.user.toString() !== userId
      );

      await workspace.save();

      const user = await User.findById(userId);
      if (user) {
        user.workspaces = user.workspaces.filter(
          w => w.toString() !== workspace._id.toString()
        );
        await user.save();
      }

      res.json(workspace);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      req.workspace.isActive = false;
      await req.workspace.save();
      res.json({ message: 'Workspace deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = workspaceController;