const express = require('express');
const { 
  getCampaigns, 
  createCampaign, 
  generateCampaignEmail 
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCampaigns)
  .post(authorize('Admin', 'Marketing Manager'), createCampaign);

router
  .route('/:id/generate-email')
  .post(authorize('Admin', 'Marketing Manager'), generateCampaignEmail);

module.exports = router;
