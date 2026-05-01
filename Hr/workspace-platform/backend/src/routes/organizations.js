const express = require('express');
const organizationController = require('../controllers/organizationController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, organizationController.create);
router.get('/:slug', auth, organizationController.getBySlug);
router.put('/:id', auth, organizationController.update);
router.post('/invite', auth, authorize('CEO', 'Manager', 'HR'), organizationController.inviteUser);
router.get('/:id/members', auth, organizationController.getMembers);
router.get('/:id/stats', auth, authorize('CEO', 'Manager', 'HR'), organizationController.getStats);

module.exports = router;