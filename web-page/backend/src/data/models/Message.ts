import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  senderName: string;
  recipientId?: string;
  channelId?: string;
  content: string;
  attachments?: string[];
  type: 'text' | 'file' | 'system';
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  recipientId: { type: String },
  channelId: { type: String },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  type: { type: String, enum: ['text', 'file', 'system'], default: 'text' },
  isRead: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });

MessageSchema.index({ senderId: 1, recipientId: 1 });
MessageSchema.index({ channelId: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
