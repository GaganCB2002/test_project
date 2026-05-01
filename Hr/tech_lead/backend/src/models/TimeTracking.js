import mongoose, { Schema } from 'mongoose';

const timeTrackingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    index: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound indexes for time tracking queries
timeTrackingSchema.index({ user: 1, date: -1 });
timeTrackingSchema.index({ project: 1, date: -1 });
timeTrackingSchema.index({ task: 1, date: -1 });

const TimeTracking = mongoose.model('TimeTracking', timeTrackingSchema);

export default TimeTracking;