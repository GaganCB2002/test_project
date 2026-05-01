import { User, Task, Project } from '../models/index.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin, Manager, TechLead)
export const getAllUsers = async (req, res) => {
  try {
    const { role, department, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
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
      message: error.message || 'Server error fetching users'
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user'
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin, Manager, TechLead)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, skills, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Employee',
      department,
      skills,
      avatar
    });

    res.status(201).json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating user'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin, Manager, TechLead, or self)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, department, skills, avatar, status } = req.body;

    // Check if user exists
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (department) user.department = department;
    if (skills) user.skills = skills;
    if (avatar !== undefined) user.avatar = avatar;
    if (status) user.status = status;

    await user.save();

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting user'
    });
  }
};

// @desc    Get tasks assigned to a user
// @route   GET /api/users/:id/tasks
// @access  Private
export const getUserTasks = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 50 } = req.query;

    const query = { assignedTo: req.params.id };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .populate('project', 'name status')
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: {
        tasks,
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
      message: error.message || 'Server error fetching user tasks'
    });
  }
};

// @desc    Get projects where user is member or owner
// @route   GET /api/users/:id/projects
// @access  Private
export const getUserProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query = {
      $or: [
        { owner: req.params.id },
        { members: req.params.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
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
      message: error.message || 'Server error fetching user projects'
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserTasks,
  getUserProjects
};
