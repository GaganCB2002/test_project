import { Workflow, Project, User } from '../models/index.js';

// @desc    Get all workflows
// @route   GET /api/workflow
// @access  Private
export const getAllWorkflows = async (req, res) => {
  try {
    const { project, page = 1, limit = 50 } = req.query;

    const query = {};

    if (project) {
      query.project = project;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const workflows = await Workflow.find(query)
      .populate('project', 'name status')
      .populate('createdBy', 'name email avatar role')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Workflow.countDocuments(query);

    res.json({
      success: true,
      data: {
        workflows,
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
      message: error.message || 'Server error fetching workflows'
    });
  }
};

// @desc    Get single workflow by ID
// @route   GET /api/workflow/:id
// @access  Private
export const getWorkflowById = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id)
      .populate('project', 'name status description')
      .populate('createdBy', 'name email avatar role department');

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }

    res.json({
      success: true,
      data: workflow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching workflow'
    });
  }
};

// @desc    Create new workflow
// @route   POST /api/workflow
// @access  Private (Admin, Manager, TechLead)
export const createWorkflow = async (req, res) => {
  try {
    const { name, description, steps, project } = req.body;

    if (!name || !project) {
      return res.status(400).json({
        success: false,
        message: 'Name and project are required'
      });
    }

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(400).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Process steps - ensure they have order and status
    const processedSteps = (steps || []).map((step, index) => ({
      title: step.title || `Step ${index + 1}`,
      description: step.description || '',
      order: step.order !== undefined ? step.order : index,
      status: step.status || 'Pending'
    }));

    const workflow = await Workflow.create({
      name,
      description,
      steps: processedSteps,
      project,
      createdBy: req.user.userId,
      currentStep: 0
    });

    const populatedWorkflow = await Workflow.findById(workflow._id)
      .populate('project', 'name status')
      .populate('createdBy', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: populatedWorkflow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating workflow'
    });
  }
};

// @desc    Update workflow
// @route   PUT /api/workflow/:id
// @access  Private (Admin, Manager, TechLead)
export const updateWorkflow = async (req, res) => {
  try {
    const { name, description, steps, currentStep } = req.body;

    let workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }

    // Update fields
    if (name) workflow.name = name;
    if (description !== undefined) workflow.description = description;
    if (steps) workflow.steps = steps;
    if (currentStep !== undefined) workflow.currentStep = currentStep;

    await workflow.save();

    const updatedWorkflow = await Workflow.findById(workflow._id)
      .populate('project', 'name status')
      .populate('createdBy', 'name email avatar role');

    res.json({
      success: true,
      data: updatedWorkflow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating workflow'
    });
  }
};

// @desc    Delete workflow
// @route   DELETE /api/workflow/:id
// @access  Private (Admin only)
export const deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }

    await Workflow.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Workflow deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting workflow'
    });
  }
};

// @desc    Update step status within a workflow
// @route   PUT /api/workflow/:id/steps/:stepId/status
// @access  Private
export const updateStepStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Completed', 'Skipped'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    let workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }

    const step = workflow.steps.id(req.params.stepId);
    if (!step) {
      return res.status(404).json({
        success: false,
        message: 'Step not found'
      });
    }

    step.status = status;

    // Update currentStep if needed
    if (status === 'Completed') {
      const nextPendingStep = workflow.steps.findIndex(
        (s, idx) => idx > workflow.currentStep && s.status === 'Pending'
      );
      if (nextPendingStep !== -1) {
        workflow.currentStep = nextPendingStep;
      }
    }

    await workflow.save();

    const updatedWorkflow = await Workflow.findById(workflow._id)
      .populate('project', 'name status')
      .populate('createdBy', 'name email avatar role');

    res.json({
      success: true,
      data: updatedWorkflow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating step status'
    });
  }
};

// @desc    Add step to workflow
// @route   POST /api/workflow/:id/steps
// @access  Private
export const addStep = async (req, res) => {
  try {
    const { title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Step title is required'
      });
    }

    let workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }

    const newOrder = order !== undefined ? order : workflow.steps.length;

    workflow.steps.push({
      title,
      description: description || '',
      order: newOrder,
      status: 'Pending'
    });

    await workflow.save();

    const updatedWorkflow = await Workflow.findById(workflow._id)
      .populate('project', 'name status')
      .populate('createdBy', 'name email avatar role');

    res.json({
      success: true,
      data: updatedWorkflow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding step'
    });
  }
};

// @desc    Remove step from workflow
// @route   DELETE /api/workflow/:id/steps/:stepId
// @access  Private
export const removeStep = async (req, res) => {
  try {
    let workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found'
      });
    }

    workflow.steps = workflow.steps.filter(
      (step) => step._id.toString() !== req.params.stepId
    );

    // Reorder remaining steps
    workflow.steps.forEach((step, index) => {
      step.order = index;
    });

    await workflow.save();

    const updatedWorkflow = await Workflow.findById(workflow._id)
      .populate('project', 'name status')
      .populate('createdBy', 'name email avatar role');

    res.json({
      success: true,
      data: updatedWorkflow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error removing step'
    });
  }
};

export default {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  updateStepStatus,
  addStep,
  removeStep
};
