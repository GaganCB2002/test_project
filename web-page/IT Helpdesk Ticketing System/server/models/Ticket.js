import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  category: {
    type: String,
    enum: ['hardware', 'software', 'network', 'access'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  comments: [commentSchema],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  slaDeadline: {
    type: Date
  },
  resolvedAt: {
    type: Date
  },
  closedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ assignedTo: 1 });

// Calculate SLA deadline based on priority
ticketSchema.pre('save', function(next) {
  if (this.isNew) {
    const hoursMap = {
      low: 72,
      medium: 48,
      high: 24,
      critical: 4
    };
    const hours = hoursMap[this.priority] || 48;
    this.slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
