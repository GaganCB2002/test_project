const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  columns: [{
    name: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'on-hold', 'cancelled'], default: 'active' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  color: { type: String, default: '#3B82F6' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);