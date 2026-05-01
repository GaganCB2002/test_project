import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
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
  status: {
    type: String,
    enum: ['Planning', 'Active', 'Completed', 'On Hold'],
    default: 'Planning',
    index: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  technologies: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Compound index for project queries
projectSchema.index({ owner: 1, status: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;