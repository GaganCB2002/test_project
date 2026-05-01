import mongoose, { Schema, Document } from 'mongoose';

export interface IEmail extends Document {
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  attachments?: string[];
  isDraft: boolean;
  isSent: boolean;
  sentAt?: Date;
  status: 'active' | 'archived' | 'deleted';
}

const EmailSchema: Schema = new Schema({
  from: { type: String, required: true },
  to: [{ type: String, required: true }],
  cc: [{ type: String }],
  subject: { type: String, default: '(No Subject)' },
  body: { type: String, required: true },
  attachments: [{ type: String }],
  isDraft: { type: Boolean, default: true },
  isSent: { type: Boolean, default: false },
  sentAt: { type: Date },
  status: { type: String, enum: ['active', 'archived', 'deleted'], default: 'active' }
}, { timestamps: true });

export default mongoose.model<IEmail>('Email', EmailSchema);
