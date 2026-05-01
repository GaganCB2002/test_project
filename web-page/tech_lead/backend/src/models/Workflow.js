import mongoose, { Schema } from 'mongoose';

const stepSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Skipped'],
    default: 'Pending'
  }
}, { _id: true });

const workflowSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  steps: [stepSchema],
  currentStep: {
    type: Number,
    default: 0
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

workflowSchema.index({ project: 1, createdBy: 1 });

const Workflow = mongoose.model('Workflow', workflowSchema);

export default Workflow;