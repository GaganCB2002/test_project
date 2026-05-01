import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET / - List all workflows
router.get('/', auth, async (req, res) => {
  try {
    // TODO: Get workflows
    // const workflows = await Workflow.find().populate('steps.createdBy', 'name');
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST / - Create new workflow
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, steps } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Workflow name is required' });
    }

    // TODO: Create workflow
    // const workflow = await Workflow.create({
    //   name,
    //   description,
    //   steps,
    //   createdBy: req.user.id
    // });

    res.status(201).json({
      success: true,
      data: { id: 'workflow._id', name, description, steps: steps || [] }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /:id - Get workflow by ID
router.get('/:id', auth, async (req, res) => {
  try {
    // TODO: Find workflow
    // const workflow = await Workflow.findById(req.params.id).populate('steps.createdBy', 'name');
    // if (!workflow) {
    //   return res.status(404).json({ success: false, message: 'Workflow not found' });
    // }
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /:id - Update workflow
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, steps } = req.body;

    // TODO: Update workflow
    // const workflow = await Workflow.findByIdAndUpdate(
    //   req.params.id,
    //   { name, description, steps },
    //   { new: true }
    // );

    res.json({ success: true, data: { id: req.params.id, name, description, steps } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /:id/steps/:stepId/status - Update step status
router.put('/:id/steps/:stepId/status', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'in-progress', 'completed', 'skipped'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // TODO: Update step status
    // const workflow = await Workflow.findOneAndUpdate(
    //   { _id: req.params.id, 'steps._id': req.params.stepId },
    //   {
    //     'steps.$.status': status,
    //     'steps.$.notes': notes,
    //     'steps.$.updatedAt': new Date()
    //   },
    //   { new: true }
    // );

    res.json({
      success: true,
      data: { workflowId: req.params.id, stepId: req.params.stepId, status, notes }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;