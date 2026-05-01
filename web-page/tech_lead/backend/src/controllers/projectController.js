import { Project, Task } from '../models/index.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getAllProjects = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
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
      message: error.message || 'Server error fetching projects'
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role department')
      .populate('members', 'name email avatar role department skills');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching project'
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin, Manager, TechLead)
export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      owner,
      members,
      startDate,
      endDate,
      priority,
      technologies
    } = req.body;

    const project = await Project.create({
      name,
      description,
      status: status || 'Planning',
      owner: owner || req.user.userId,
      members: members || [],
      startDate,
      endDate,
      priority: priority || 'Medium',
      technologies
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating project'
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin, Manager, TechLead, Owner)
export const updateProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      priority,
      technologies
    } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update fields
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (priority) project.priority = priority;
    if (technologies !== undefined) project.technologies = technologies;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating project'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting project'
    });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/add-member
// @access  Private (Admin, Manager, TechLead, Owner)
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is already a member
    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }

    // Check if user is the owner
    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'User is the owner of this project'
      });
    }

    project.members.push(userId);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding member'
    });
  }
};

// @desc    Remove member from project
// @route   PUT /api/projects/:id/remove-member
// @access  Private (Admin, Manager, TechLead, Owner)
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error removing member'
    });
  }
};

// @desc    Update project progress
// @route   PUT /api/projects/:id/update-progress
// @access  Private (Admin, Manager, TechLead, Owner)
export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number between 0 and 100'
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.progress = progress;
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating progress'
    });
  }
};

// @desc    Calculate and update project progress based on tasks
// @route   PUT /api/projects/:id/calculate-progress
// @access  Private
export const calculateProgress = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const tasks = await Task.find({ project: project._id });

    if (tasks.length === 0) {
      project.progress = 0;
    } else {
      const completedTasks = tasks.filter(
        (task) => task.status === 'Done' || task.status === 'Completed'
      ).length;
      project.progress = Math.round((completedTasks / tasks.length) * 100);
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error calculating progress'
    });
  }
};

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateProgress,
  calculateProgress
};
