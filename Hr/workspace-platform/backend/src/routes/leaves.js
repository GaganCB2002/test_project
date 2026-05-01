const express = require('express');
const leaveController = require('../controllers/leaveController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, leaveController.create);
router.get('/my-requests', auth, leaveController.getMyRequests);
router.get('/team', auth, authorize('CEO', 'Manager', 'HR'), leaveController.getTeamRequests);
router.put('/:id/approve', auth, authorize('CEO', 'Manager', 'HR'), leaveController.approve);
router.put('/:id/reject', auth, authorize('CEO', 'Manager', 'HR'), leaveController.reject);

module.exports = router;