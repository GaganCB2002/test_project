import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date },
  totalHours: { type: Number, default: 0 },
}, { timestamps: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
