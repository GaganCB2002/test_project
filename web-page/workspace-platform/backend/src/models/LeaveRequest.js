const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  leaveType: {
    type: String,
    enum: ['sick', 'vacation', 'personal', 'parental', 'bereavement', 'other'],
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);