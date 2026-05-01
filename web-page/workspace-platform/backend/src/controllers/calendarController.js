const CalendarEvent = require('../models/CalendarEvent');
const User = require('../models/User');

const calendarController = {
  create: async (req, res) => {
    try {
      const { title, description, start, end, allDay, color, location, attendees, isMeeting, meetingLink } = req.body;

      const event = new CalendarEvent({
        title,
        description,
        user: req.user._id,
        workspace: req.body.workspaceId,
        start,
        end,
        allDay,
        color,
        location,
        attendees,
        isMeeting,
        meetingLink
      });

      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const { start, end } = req.query;
      const query = { user: req.user._id };

      if (start && end) {
        query.start = { $gte: new Date(start) };
        query.end = { $lte: new Date(end) };
      }

      const events = await CalendarEvent.find(query)
        .populate('attendees.user', 'firstName lastName avatar')
        .sort('start');

      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const event = await CalendarEvent.findById(req.params.id)
        .populate('attendees.user', 'firstName lastName avatar email');

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = ['title', 'description', 'start', 'end', 'allDay', 'color', 'location', 'isMeeting', 'meetingLink'];
      const event = req.event;

      updates.forEach(field => {
        if (req.body[field] !== undefined) {
          event[field] = req.body[field];
        }
      });

      await event.save();
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await CalendarEvent.findByIdAndDelete(req.params.id);
      res.json({ message: 'Event deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addAttendee: async (req, res) => {
    try {
      const { userId } = req.body;
      const event = req.event;

      const exists = event.attendees.find(a => a.user.toString() === userId);
      if (exists) {
        return res.status(400).json({ message: 'User already invited' });
      }

      event.attendees.push({ user: userId, status: 'pending' });
      await event.save();

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  rsvp: async (req, res) => {
    try {
      const { status } = req.body;
      const event = req.event;
      const userId = req.user._id;

      const attendee = event.attendees.find(a => a.user.toString() === userId.toString());
      if (attendee) {
        attendee.status = status;
        await event.save();
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = calendarController;