import { Schema, model } from 'mongoose'

export const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  department: String,
  avatar: String,
})

export const activitySchema = new Schema({
  id: String,
  title: String,
  detail: String,
  timestamp: { type: Date, default: Date.now },
  actor: String,
  category: String,
})

export const messageSchema = new Schema({
  id: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: String,
  groupId: String,
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

export const emailSchema = new Schema({
  id: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: String,
  receiverId: { type: String, required: true },
  subject: String,
  body: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  folder: { type: String, enum: ['inbox', 'sent', 'favorites', 'trash'], default: 'inbox' }
})

export const meetingSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  organizer: String,
  participants: [String],
  status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
  meetingId: String
})

export const notificationSchema = new Schema({
  id: String,
  userId: String,
  title: String,
  message: String,
  type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
})

export const User = model('User', userSchema)
export const Activity = model('Activity', activitySchema)
export const Message = model('Message', messageSchema)
export const Email = model('Email', emailSchema)
export const Meeting = model('Meeting', meetingSchema)
export const Notification = model('Notification', notificationSchema)
