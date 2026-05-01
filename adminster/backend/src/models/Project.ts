import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'completed', 'on_hold'], default: 'active' },
  deadline: { type: Date },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
