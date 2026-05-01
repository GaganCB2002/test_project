import mongoose, { Schema } from 'mongoose';

const dateRangeSchema = new Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  }
}, { _id: false });

const reportSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    required: true,
    index: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    index: true
  },
  dateRange: dateRangeSchema,
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }]
}, {
  timestamps: true
});

// Compound indexes for report queries
reportSchema.index({ author: 1, type: 1, createdAt: -1 });
reportSchema.index({ project: 1, type: 1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;