const User = require('../models/User');

const userController = {
  getAll: async (req, res) => {
    try {
      const users = await User.find({ organization: req.user.organization })
        .select('-password')
        .sort('role firstName');

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('organization', 'name slug');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = ['firstName', 'lastName', 'phone', 'department', 'avatar'];
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      updates.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateRole: async (req, res) => {
    try {
      const { role, department } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (role) user.role = role;
      if (department) user.department = department;

      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deactivate: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deactivated', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  activate: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: true },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User activated', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;