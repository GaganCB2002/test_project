const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/dashboard', auth, analyticsController.getDashboardStats);
router.get('/trends', auth, analyticsController.getProductivityTrends);
router.get('/tasks/:workspaceId', auth, analyticsController.getTaskAnalytics);
router.get('/user/:userId/performance', auth, analyticsController.getUserPerformance);
router.get('/team/:workspaceId', auth, authorize('CEO', 'Manager', 'HR'), analyticsController.getTeamAnalytics);

module.exports = router;