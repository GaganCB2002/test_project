import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: string;
  date: Date;
  status: 'Present' | 'Absent' | 'WFH' | 'Leave';
  checkIn?: string;
  checkOut?: string;
  lateMarking: boolean;
  overtimeHours: number;
}

const AttendanceSchema: Schema = new Schema({
  employeeId: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'WFH', 'Leave'], default: 'Present' },
  checkIn: { type: String },
  checkOut: { type: String },
  lateMarking: { type: Boolean, default: false },
  overtimeHours: { type: Number, default: 0 }
}, { timestamps: true });

// Index for fast lookups per employee/day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
