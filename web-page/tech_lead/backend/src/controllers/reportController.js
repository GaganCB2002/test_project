import { Report, Project, User } from '../models/index.js';

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (Admin, Manager, TechLead)
export const getAllReports = async (req, res) => {
  try {
    const { type, project, author, page = 1, limit = 50 } = req.query;

    const query = {};

    if (type) {
      query.type = type;
    }

    if (project) {
      query.project = project;
    }

    if (author) {
      query.author = author;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find(query)
      .populate('author', 'name email avatar role')
      .populate('project', 'name status')
      .populate('attachments', 'filename originalName mimeType size')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
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
      message: error.message || 'Server error fetching reports'
    });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('author', 'name email avatar role department')
      .populate('project', 'name status description')
      .populate('attachments', 'filename originalName mimeType size path');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching report'
    });
  }
};

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      project,
      dateRange,
      attachments
    } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and type are required'
      });
    }

    // Verify project exists if provided
    if (project) {
      const projectExists = await Project.findById(project);
      if (!projectExists) {
        return res.status(400).json({
          success: false,
          message: 'Project not found'
        });
      }
    }

    const report = await Report.create({
      title,
      content,
      type,
      author: req.user.userId,
      project: project || null,
      dateRange: dateRange || null,
      attachments: attachments || []
    });

    const populatedReport = await Report.findById(report._id)
      .populate('author', 'name email avatar role')
      .populate('project', 'name status')
      .populate('attachments', 'filename originalName mimeType size');

    res.status(201).json({
      success: true,
      data: populatedReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating report'
    });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private (Admin, Manager, TechLead, or author)
export const updateReport = async (req, res) => {
  try {
    const { title, content, type, dateRange, attachments } = req.body;

    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user is author or has admin privileges
    const user = await User.findById(req.user.userId);
    if (
      report.author.toString() !== req.user.userId &&
      !['Admin', 'Manager', 'TechLead'].includes(user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this report'
      });
    }

    // Update fields
    if (title) report.title = title;
    if (content) report.content = content;
    if (type) report.type = type;
    if (dateRange !== undefined) report.dateRange = dateRange;
    if (attachments !== undefined) report.attachments = attachments;

    await report.save();

    const updatedReport = await Report.findById(report._id)
      .populate('author', 'name email avatar role')
      .populate('project', 'name status')
      .populate('attachments', 'filename originalName mimeType size');

    res.json({
      success: true,
      data: updatedReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating report'
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (Admin, Manager, TechLead, or author)
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user is author or has admin privileges
    const user = await User.findById(req.user.userId);
    if (
      report.author.toString() !== req.user.userId &&
      !['Admin', 'Manager', 'TechLead'].includes(user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report'
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting report'
    });
  }
};

// @desc    Get reports by current user
// @route   GET /api/reports/my-reports
// @access  Private
export const getUserReports = async (req, res) => {
  try {
    const { type, project, page = 1, limit = 50 } = req.query;

    const query = { author: req.user.userId };

    if (type) {
      query.type = type;
    }

    if (project) {
      query.project = project;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find(query)
      .populate('author', 'name email avatar role')
      .populate('project', 'name status')
      .populate('attachments', 'filename originalName mimeType size')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
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
      message: error.message || 'Server error fetching user reports'
    });
  }
};

// @desc    Get reports by project
// @route   GET /api/reports/project/:projectId
// @access  Private
export const getProjectReports = async (req, res) => {
  try {
    const { type, page = 1, limit = 50 } = req.query;

    const query = { project: req.params.projectId };

    if (type) {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find(query)
      .populate('author', 'name email avatar role')
      .populate('attachments', 'filename originalName mimeType size')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
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
      message: error.message || 'Server error fetching project reports'
    });
  }
};

export default {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getUserReports,
  getProjectReports
};
