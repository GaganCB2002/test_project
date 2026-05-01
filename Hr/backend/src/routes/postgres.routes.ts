import { Router } from 'express';
import { pgService } from '../services/postgres.service';
import multer from 'multer';
import path from 'path';

const router = Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { role, type, projectId } = req.body;
    let dest = `storage/${role === 'tech_lead' ? 'tech_leads_data' : 'employee_data'}/${type || 'documents'}`;
    
    // Override for projects
    if (projectId) {
      dest = `storage/projects/project_${projectId}/${type || 'documents'}`;
    }
    
    // Ensure directory exists
    const fs = require('fs');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// --- 👤 Employee Routes ---
router.post('/employees', async (req, res) => {
  try {
    const employee = await pgService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/employees', async (req, res) => {
  // Simple list for assignment
  const { rows } = await require('../db_config').query('SELECT id, name, role FROM employee_data.employees');
  res.json(rows);
});

router.get('/employees/:id', async (req, res) => {
  const employee = await pgService.getEmployeeById(req.params.id);
  res.json(employee);
});

// --- 🌴 Leave Management System (Enterprise Upgrade) ---
router.post('/leave/apply', async (req, res) => {
  try {
    const leave = await pgService.applyLeave(req.body);
    const io = req.app.get('io');
    // Notify HR
    io.emit('leave_update', { ...leave, employee_name: req.body.employeeName });
    res.status(201).json(leave);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/leave/my-requests', async (req, res) => {
  const { employeeId } = req.query;
  const requests = await pgService.getMyRequests(employeeId as string);
  res.json(requests);
});

router.get('/leave/all', async (req, res) => {
  const requests = await pgService.getAllRequests();
  res.json(requests);
});

router.post('/leave/approve/:id', async (req, res) => {
  try {
    const leave = await pgService.updateLeaveStatus(req.params.id, 'APPROVED', '');
    const io = req.app.get('io');
    io.emit('leave_status_update', { id: req.params.id, status: 'APPROVED', hrReason: '' });
    res.json(leave);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/leave/reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'Rejection reason is mandatory.' });
    const leave = await pgService.updateLeaveStatus(req.params.id, 'REJECTED', reason);
    const io = req.app.get('io');
    io.emit('leave_status_update', { id: req.params.id, status: 'REJECTED', hrReason: reason });
    res.json(leave);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- 🏗️ Project Management Routes ---
router.get('/projects', async (req, res) => {
  const projects = await pgService.getProjects();
  res.json(projects);
});

router.get('/projects/:id', async (req, res) => {
  const project = await pgService.getProjectById(req.params.id);
  res.json(project);
});

router.get('/projects/:id/employees', async (req, res) => {
  const employees = await pgService.getProjectEmployees(req.params.id);
  res.json(employees);
});

router.get('/projects/:id/files', async (req, res) => {
  const files = await pgService.getProjectFiles(req.params.id);
  res.json(files);
});

router.post('/projects/:id/assign-employee', async (req, res) => {
  const assignment = await pgService.assignEmployeeToProject(req.params.id, req.body.employeeId);
  res.json(assignment);
});

router.post('/projects/:id/upload-file', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const fileData = {
    projectId: req.params.id,
    fileName: req.file.originalname,
    fileType: req.body.fileType,
    filePath: req.file.path,
    uploadedBy: req.body.uploadedBy
  };

  const registered = await pgService.uploadProjectFile(fileData);
  res.json(registered);
});

// --- 📁 File Upload Route (Generic) ---
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const fileData = {
    employeeId: req.body.employeeId,
    fileName: req.file.originalname,
    fileType: req.body.fileType, // 'image', 'video', etc.
    filePath: req.file.path,
    fileSize: req.file.size
  };

  const registered = await pgService.registerFile(fileData);
  res.json(registered);
});

// --- 💬 Chat Routes ---
router.post('/chat', async (req, res) => {
  const msg = await pgService.saveChatMessage(req.body);
  res.json(msg);
});

// --- 📊 Stats Routes ---
router.get('/stats/:employeeId', async (req, res) => {
  const stats = await pgService.getEmployeeStats(req.params.employeeId);
  res.json(stats);
});

export default router;
