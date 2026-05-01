const express = require('express');
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, notificationController.getAll);
router.put('/:id/read', auth, notificationController.markAsRead);
router.put('/read-all', auth, notificationController.markAllAsRead);
router.delete('/:id', auth, notificationController.delete);

module.exports = router;