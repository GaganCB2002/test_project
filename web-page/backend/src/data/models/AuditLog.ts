import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  userName: string;
  action: 'LOGIN' | 'LOGOUT' | 'FILE_UPLOAD' | 'MEETING_CREATE' | 'EMAIL_SENT' | 'SYSTEM_CONFIG_CHANGE';
  details: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  action: { 
    type: String, 
    enum: ['LOGIN', 'LOGOUT', 'FILE_UPLOAD', 'MEETING_CREATE', 'EMAIL_SENT', 'SYSTEM_CONFIG_CHANGE'],
    required: true 
  },
  details: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
