import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Review', 'Testing', 'Done'],
    default: 'Todo',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  dueDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  loggedHours: {
    type: Number,
    min: 0,
    default: 0
  },
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }],
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  labels: [{
    type: String,
    trim: true
  }],
  comments: [commentSchema]
}, {
  timestamps: true
});

// Compound indexes for common queries
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;