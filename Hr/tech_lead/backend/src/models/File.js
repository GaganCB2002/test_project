import mongoose, { Schema } from 'mongoose';

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedBy: {
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
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    index: true
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Compound indexes for file queries
fileSchema.index({ project: 1, uploadedBy: 1 });
fileSchema.index({ task: 1, uploadedBy: 1 });
fileSchema.index({ uploadedBy: 1, createdAt: -1 });

const File = mongoose.model('File', fileSchema);

export default File;