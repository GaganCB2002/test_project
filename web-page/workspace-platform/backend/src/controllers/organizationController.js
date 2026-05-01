const Organization = require('../models/Organization');
const User = require('../models/User');

const organizationController = {
  create: async (req, res) => {
    try {
      const { name, slug, logo, website, description } = req.body;

      const existing = await Organization.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: 'Organization slug already exists' });
      }

      const organization = new Organization({
        name,
        slug,
        logo,
        website,
        description,
        owner: req.user._id,
        departments: ['HR', 'IT', 'Marketing', 'Sales', 'Finance', 'Operations']
      });

      await organization.save();

      req.user.organization = organization._id;
      req.user.role = 'CEO';
      await req.user.save();

      res.status(201).json(organization);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBySlug: async (req, res) => {
    try {
      const organization = await Organization.findOne({ slug: req.params.slug })
        .populate('owner', 'firstName lastName email avatar');

      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }

      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = ['name', 'logo', 'website', 'description', 'settings', 'departments'];
      const organization = req.organization;

      updates.forEach(field => {
        if (req.body[field] !== undefined) {
          organization[field] = req.body[field];
        }
      });

      await organization.save();
      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  inviteUser: async (req, res) => {
    try {
      const { email, role, department } = req.body;

      let user = await User.findOne({ email });

      if (user) {
        if (user.organization && user.organization.toString() !== req.organization._id.toString()) {
          return res.status(400).json({ message: 'User belongs to another organization' });
        }

        user.organization = req.organization._id;
        user.role = role || 'Employee';
        user.department = department || 'Employee';
      } else {
        user = new User({
          email,
          password: 'tempPassword123',
          firstName: email.split('@')[0],
          lastName: '',
          organization: req.organization._id,
          role: role || 'Employee',
          department: department || 'Employee'
        });
      }

      await user.save();

      res.json({ message: 'User invited successfully', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMembers: async (req, res) => {
    try {
      const members = await User.find({ organization: req.organization._id })
        .select('-password')
        .sort({ role: 1, firstName: 1 });

      res.json(members);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStats: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments({ organization: req.organization._id });
      const activeUsers = await User.countDocuments({
        organization: req.organization._id,
        isActive: true
      });

      res.json({
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = organizationController;