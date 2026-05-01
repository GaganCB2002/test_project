const express = require('express');
const { getLeads, createLead, updateLead } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('Admin', 'Marketing Manager', 'Sales Manager', 'Sales Executive', 'Viewer'), getLeads)
  .post(authorize('Admin', 'Marketing Manager', 'Sales Manager', 'Sales Executive'), createLead);

router
  .route('/:id')
  .put(authorize('Admin', 'Marketing Manager', 'Sales Manager', 'Sales Executive'), updateLead);

module.exports = router;
