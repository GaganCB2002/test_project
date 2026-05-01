const express = require('express');
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, authorize('CEO', 'Manager', 'HR', 'Admin'), userController.getAll);
router.get('/:id', auth, userController.getById);
router.put('/:id', auth, authorize('CEO', 'Manager', 'HR'), userController.update);
router.put('/:id/role', auth, authorize('CEO', 'Manager'), userController.updateRole);
router.delete('/:id', auth, authorize('CEO', 'Manager', 'HR'), userController.deactivate);
router.put('/:id/activate', auth, authorize('CEO', 'Manager', 'HR'), userController.activate);

module.exports = router;