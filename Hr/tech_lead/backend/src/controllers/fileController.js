import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { File, User } from '../models/index.js';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed',
    'audio/mpeg',
    'audio/wav',
    'video/mp4',
    'video/mpeg'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Export upload middleware
export const uploadMiddleware = upload.single('file');

// @desc    Get all files with optional filters
// @route   GET /api/files
// @access  Private
export const getFiles = async (req, res) => {
  try {
    const { project, task, uploadedBy, mimeType, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (project) {
      query.project = project;
    }

    if (task) {
      query.task = task;
    }

    if (uploadedBy) {
      query.uploadedBy = uploadedBy;
    }

    if (mimeType) {
      query.mimeType = { $regex: mimeType, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const files = await File.find(query)
      .populate('uploadedBy', 'name email avatar')
      .populate('project', 'name status')
      .populate('task', 'title status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await File.countDocuments(query);

    res.json({
      success: true,
      data: {
        files,
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
      message: error.message || 'Server error fetching files'
    });
  }
};

// @desc    Get single file by ID
// @route   GET /api/files/:id
// @access  Private
export const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('uploadedBy', 'name email avatar')
      .populate('project', 'name status')
      .populate('task', 'title status');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching file'
    });
  }
};

// @desc    Upload file
// @route   POST /api/files
// @access  Private
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { project, task } = req.body;

    const file = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user.userId,
      project: project || null,
      task: task || null
    });

    const populatedFile = await File.findById(file._id)
      .populate('uploadedBy', 'name email avatar')
      .populate('project', 'name status')
      .populate('task', 'title status');

    // Emit socket event
    if (req.io) {
      req.io.emit('file_uploaded', populatedFile);
    }

    res.status(201).json({
      success: true,
      data: populatedFile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error uploading file'
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private (Admin, Manager, TechLead, or uploader)
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user is the uploader or has admin privileges
    const user = await User.findById(req.user.userId);
    if (
      file.uploadedBy.toString() !== req.user.userId &&
      !['Admin', 'Manager', 'TechLead'].includes(user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this file'
      });
    }

    // Delete the physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await File.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting file'
    });
  }
};

// @desc    Get files by project
// @route   GET /api/files/project/:projectId
// @access  Private
export const getFilesByProject = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const files = await File.find({ project: req.params.projectId })
      .populate('uploadedBy', 'name email avatar')
      .populate('task', 'title status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await File.countDocuments({ project: req.params.projectId });

    res.json({
      success: true,
      data: {
        files,
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
      message: error.message || 'Server error fetching project files'
    });
  }
};

// @desc    Get files by task
// @route   GET /api/files/task/:taskId
// @access  Private
export const getFilesByTask = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const files = await File.find({ task: req.params.taskId })
      .populate('uploadedBy', 'name email avatar')
      .populate('project', 'name status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await File.countDocuments({ task: req.params.taskId });

    res.json({
      success: true,
      data: {
        files,
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
      message: error.message || 'Server error fetching task files'
    });
  }
};

// @desc    Download file
// @route   GET /api/files/:id/download
// @access  Private
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error downloading file'
    });
  }
};

export default {
  uploadMiddleware,
  getFiles,
  getFile,
  uploadFile,
  deleteFile,
  getFilesByProject,
  getFilesByTask,
  downloadFile
};
