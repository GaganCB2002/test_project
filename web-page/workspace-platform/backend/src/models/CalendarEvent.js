const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
  color: { type: String, default: '#3B82F6' },
  location: { type: String },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
  }],
  reminders: [{ type: Number }],
  recurrence: {
    pattern: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    interval: { type: Number, default: 1 },
    endDate: { type: Date }
  },
  googleEventId: { type: String },
  isMeeting: { type: Boolean, default: false },
  meetingLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);