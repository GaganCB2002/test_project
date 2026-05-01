const express = require('express');
const workspaceController = require('../controllers/workspaceController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, workspaceController.create);
router.get('/', auth, workspaceController.getAll);
router.get('/:id', auth, workspaceController.getById);
router.put('/:id', auth, workspaceController.update);
router.post('/:id/members', auth, authorize('CEO', 'Manager', 'HR', 'Admin'), workspaceController.addMember);
router.delete('/:id/members/:userId', auth, authorize('CEO', 'Manager', 'HR', 'Admin'), workspaceController.removeMember);
router.delete('/:id', auth, authorize('CEO', 'Manager', 'HR', 'Admin'), workspaceController.delete);

module.exports = router;