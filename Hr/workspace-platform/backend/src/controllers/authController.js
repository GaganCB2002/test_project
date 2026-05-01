const User = require('../models/User');
const { generateTokens } = require('../utils/jwt');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, organizationId } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName,
        organization: organizationId
      });

      await user.save();

      const tokens = generateTokens(user._id);
      user.loginHistory.push({ date: new Date(), ip: req.ip, device: req.get('user-agent') });
      await user.save();

      res.status(201).json({
        message: 'Registration successful',
        user,
        ...tokens
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).populate('organization');
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      user.lastLogin = new Date();
      user.loginHistory.push({
        date: new Date(),
        ip: req.ip,
        device: req.get('user-agent')
      });
      await user.save();

      const tokens = generateTokens(user._id);

      res.json({
        message: 'Login successful',
        user,
        ...tokens
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
      }

      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found' });
      }

      const tokens = generateTokens(user._id);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  },

  logout: async (req, res) => {
    res.json({ message: 'Logged out successfully' });
  },

  getMe: async (req, res) => {
    res.json(req.user);
  },

  updateProfile: async (req, res) => {
    try {
      const updates = ['firstName', 'lastName', 'phone', 'avatar'];
      const user = req.user;

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

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const isMatch = await req.user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      req.user.password = newPassword;
      await req.user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController;