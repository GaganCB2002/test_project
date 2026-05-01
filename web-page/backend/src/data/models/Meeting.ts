import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  hostId: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  roomUrl: string;
  recordingUrl?: string;
  agenda?: string;
  notes?: string;
}

const MeetingSchema: Schema = new Schema({
  title: { type: String, required: true },
  hostId: { type: String, required: true },
  participants: [{ type: String }],
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
  roomUrl: { type: String, required: true },
  recordingUrl: { type: String },
  agenda: { type: String },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
