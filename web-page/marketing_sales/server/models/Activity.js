const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  type: {
    type: String,
    enum: ['Lead', 'Deal', 'Campaign', 'System'],
    required: true,
  },
  action: {
    type: String,
    required: true, // e.g., 'Created', 'Updated', 'Deleted', 'Status Change'
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    targetId: mongoose.Schema.Types.ObjectId,
    targetName: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Activity', activitySchema);
