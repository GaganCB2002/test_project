const Project = require('../models/Project');
const Task = require('../models/Task');

const projectController = {
  create: async (req, res) => {
    try {
      const { name, description, startDate, endDate, priority, color, memberIds } = req.body;
      const workspaceId = req.params.workspaceId;

      const project = new Project({
        name,
        description,
        workspace: workspaceId,
        createdBy: req.user._id,
        owner: req.user._id,
        members: memberIds ? [...memberIds, req.user._id] : [req.user._id],
        columns: [
          { name: 'To Do', order: 0 },
          { name: 'In Progress', order: 1 },
          { name: 'Review', order: 2 },
          { name: 'Done', order: 3 }
        ],
        startDate,
        endDate,
        priority,
        color
      });

      await project.save();
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;
      const projects = await Project.find({ workspace: workspaceId })
        .populate('createdBy', 'firstName lastName avatar')
        .populate('owner', 'firstName lastName avatar')
        .populate('members', 'firstName lastName avatar role')
        .sort('-createdAt');

      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate('createdBy', 'firstName lastName avatar')
        .populate('owner', 'firstName lastName avatar')
        .populate('members', 'firstName lastName avatar role department');

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const tasks = await Task.find({ project: project._id })
        .populate('assignedTo', 'firstName lastName avatar')
        .populate('createdBy', 'firstName lastName avatar')
        .sort('order');

      res.json({ project, tasks });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { name, description, startDate, endDate, priority, color, status } = req.body;
      const project = req.project;

      const updates = { name, description, startDate, endDate, priority, color, status };
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) project[key] = updates[key];
      });

      await project.save();
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addMembers: async (req, res) => {
    try {
      const { memberIds } = req.body;
      const project = req.project;

      memberIds.forEach(memberId => {
        if (!project.members.includes(memberId)) {
          project.members.push(memberId);
        }
      });

      await project.save();
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeMember: async (req, res) => {
    try {
      const { memberId } = req.params;
      const project = req.project;

      project.members = project.members.filter(m => m.toString() !== memberId);
      await project.save();
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Task.deleteMany({ project: req.project._id });
      await Project.findByIdAndDelete(req.project._id);
      res.json({ message: 'Project deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = projectController;