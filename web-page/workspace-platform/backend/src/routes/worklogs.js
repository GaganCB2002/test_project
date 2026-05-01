const express = require('express');
const workLogController = require('../controllers/workLogController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, workLogController.create);
router.get('/', auth, workLogController.getMyLogs);
router.put('/:id', auth, workLogController.update);
router.delete('/:id', auth, workLogController.delete);
router.post('/start-tracking', auth, workLogController.startTracking);
router.post('/stop-tracking', auth, workLogController.stopTracking);
router.post('/location', auth, workLogController.updateLocation);

module.exports = router;