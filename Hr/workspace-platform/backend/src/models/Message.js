const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    size: Number
  }],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: { type: String }
  }],
  isEdited: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ channel: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);