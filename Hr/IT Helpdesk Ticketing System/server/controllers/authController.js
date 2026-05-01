import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET, JWT_EXPIRE } from '../config/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, department, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      department,
      role: role || 'employee'
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully.' });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user.toJSON() });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, department, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, department, avatar },
      { new: true, runValidators: true }
    );

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};
