import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { auth } from '../middleware/auth.js';

const router = Router();

// POST /register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }

    const token = jwt.sign(
      { id: 'u-lead', email, name, role: 'Lead' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: { id: 'u-lead', email, name },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const token = jwt.sign(
      { id: 'u-lead', email, name: 'Tech Lead', role: 'Lead' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: { id: 'u-lead', email, name: 'Tech Lead' },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /logout - Logout user
router.post('/logout', auth, (req, res) => {
  // For JWT-based auth, client should delete the token
  // Server can implement token blacklisting if needed
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /me - Get current user
router.get('/me', auth, async (req, res) => {
  try {
    // TODO: Find user by req.user.id
    // const user = await User.findById(req.user.id).select('-password');
    // if (!user) {
    //   return res.status(404).json({ success: false, message: 'User not found' });
    // }

    res.json({
      success: true,
      data: { id: req.user.id, email: req.user.email, name: req.user.name }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /change-password - Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    // TODO: Find user and verify current password
    // const user = await User.findById(req.user.id);
    // const isMatch = await bcrypt.compare(currentPassword, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    // }

    // user.password = await bcrypt.hash(newPassword, 10);
    // await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;