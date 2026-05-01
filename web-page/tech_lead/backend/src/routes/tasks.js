import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET / - List all tasks
router.get('/', auth, async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;

    // TODO: Build query and get tasks
    // const query = {};
    // if (projectId) query.projectId = projectId;
    // if (status) query.status = status;
    // if (priority) query.priority = priority;
    // const tasks = await Task.find(query).populate('assignee', 'name email');

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST / - Create new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, projectId, priority, dueDate, assignee } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: 'Title and projectId are required' });
    }

    // TODO: Create task
    // const task = await Task.create({
    //   title,
    //   description,
    //   projectId,
    //   priority,
    //   dueDate,
    //   assignee,
    //   createdBy: req.user.id
    // });

    res.status(201).json({
      success: true,
      data: { id: 'task._id', title, description, projectId, priority, status: 'pending' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /:id - Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    // TODO: Find task
    // const task = await Task.findById(req.params.id)
    //   .populate('assignee', 'name email')
    //   .populate('projectId', 'name');
    // if (!task) {
    //   return res.status(404).json({ success: false, message: 'Task not found' });
    // }
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /:id - Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    // TODO: Update task
    // const task = await Task.findByIdAndUpdate(
    //   req.params.id,
    //   { title, description, priority, dueDate, status },
    //   { new: true }
    // );

    res.json({ success: true, data: { id: req.params.id, title, description, priority, status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /:id - Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    // TODO: Delete task
    // await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /:id/status - Update task status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'review', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // TODO: Update task status
    // const task = await Task.findByIdAndUpdate(
    //   req.params.id,
    //   { status },
    //   { new: true }
    // );

    res.json({ success: true, data: { id: req.params.id, status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /:id/assign - Assign task to user
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const { assignee } = req.body;

    // TODO: Assign task
    // const task = await Task.findByIdAndUpdate(
    //   req.params.id,
    //   { assignee },
    //   { new: true }
    // );

    res.json({ success: true, data: { id: req.params.id, assignee } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;