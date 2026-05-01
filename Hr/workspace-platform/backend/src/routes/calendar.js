const express = require('express');
const calendarController = require('../controllers/calendarController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, calendarController.create);
router.get('/', auth, calendarController.getAll);
router.get('/:id', auth, calendarController.getById);
router.put('/:id', auth, calendarController.update);
router.delete('/:id', auth, calendarController.delete);
router.post('/:id/attendees', auth, calendarController.addAttendee);
router.put('/:id/rsvp', auth, calendarController.rsvp);

module.exports = router;