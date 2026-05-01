const Campaign = require('../models/Campaign');
const aiService = require('../services/aiService');

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ companyId: req.user.companyId });
    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
  try {
    req.body.companyId = req.user.companyId;
    req.body.createdBy = req.user.id;

    const campaign = await Campaign.create(req.body);
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Generate campaign email using AI
// @route   POST /api/campaigns/:id/generate-email
// @access  Private
exports.generateCampaignEmail = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const emailContent = await aiService.generateEmail(campaign);
    res.status(200).json({ success: true, data: emailContent });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
