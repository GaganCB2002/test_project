import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true,
    index: true
  },
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }],
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for room-based queries
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ sender: 1, isRead: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;