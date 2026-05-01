const Deal = require('../models/Deal');

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ companyId: req.user.companyId });
    res.status(200).json({ success: true, count: deals.length, data: deals });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new deal
// @route   POST /api/deals
// @access  Private
exports.createDeal = async (req, res) => {
  try {
    req.body.companyId = req.user.companyId;
    req.body.owner = req.user.id;

    const deal = await Deal.create(req.body);
    res.status(201).json({ success: true, data: deal });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update deal stage
// @route   PUT /api/deals/:id/stage
// @access  Private
exports.updateDealStage = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    if (deal.companyId !== req.user.companyId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    deal.stage = req.body.stage;
    await deal.save();

    res.status(200).json({ success: true, data: deal });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
