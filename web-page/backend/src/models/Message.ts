import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  username: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);
