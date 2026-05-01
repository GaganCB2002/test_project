const mongoose = require('mongoose');

const workLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  minutes: { type: Number, default: 0 },
  description: { type: String },
  screenshots: [{ type: String }],
  appUsage: [{
    app: { type: String },
    duration: { type: Number }
  }],
  browserUsage: [{
    browser: { type: String },
    tabs: { type: Number },
    duration: { type: Number }
  }],
  activeTime: { type: Number, default: 0 },
  idleTime: { type: Number, default: 0 }
}, { timestamps: true });

workLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WorkLog', workLogSchema);