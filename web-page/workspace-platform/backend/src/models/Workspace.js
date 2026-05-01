const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['public', 'private'], default: 'public' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  settings: {
    allowMemberInvite: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);