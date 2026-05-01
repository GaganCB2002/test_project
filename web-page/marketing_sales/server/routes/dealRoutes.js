const express = require('express');
const { 
  getDeals, 
  createDeal, 
  updateDealStage 
} = require('../controllers/dealController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getDeals)
  .post(authorize('Admin', 'Sales Manager', 'Sales Executive'), createDeal);

router
  .route('/:id/stage')
  .put(authorize('Admin', 'Sales Manager', 'Sales Executive'), updateDealStage);

module.exports = router;
