const Lead = require('../models/Lead');
const aiService = require('../services/aiService');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ companyId: req.user.companyId });
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private (Marketing, Sales Admin)
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead({
      ...req.body,
      companyId: req.user.companyId,
      createdBy: req.user.id
    });

    // AI Lead Scoring
    lead.aiScore = await aiService.getLeadScore(lead);

    await lead.save();

    // Real-time Notification
    await notificationService.createActivity(req.app.get('io'), {
      companyId: req.user.companyId,
      userId: req.user.id,
      userName: req.user.name,
      type: 'Lead',
      action: 'Created',
      description: `New lead ${lead.name} from ${lead.company} was added.`,
      metadata: { targetId: lead._id, targetName: lead.name }
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: true, message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Make sure user is lead owner or admin
    if (lead.companyId !== req.user.companyId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
