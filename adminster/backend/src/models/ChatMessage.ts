import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String },
  channelId: { type: String }, // For group chats
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
