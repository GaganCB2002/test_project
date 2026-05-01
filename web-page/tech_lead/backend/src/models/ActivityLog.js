import mongoose, { Schema } from 'mongoose';

const activityLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  entityType: {
    type: String,
    required: true,
    index: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  metadata: {
    type: Schema,
    default: {}
  }
}, {
  timestamps: true
});

// Compound indexes for activity log queries
activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;