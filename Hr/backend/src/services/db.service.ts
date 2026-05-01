import mongoose, { Schema } from 'mongoose'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { store } from '../data/store'

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aurahr'
const DB_PATH = path.join(__dirname, '../../data/db.json')

// Define Schemas for MongoDB
const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  department: String,
  avatar: String,
})

const activitySchema = new Schema({
  id: String,
  title: String,
  detail: String,
  timestamp: { type: Date, default: Date.now },
  actor: String,
  category: String,
})

const messageSchema = new Schema({
  id: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: String,
  groupId: String,
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

const emailSchema = new Schema({
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

const meetingSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  organizer: String,
  participants: [String],
  status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
  meetingId: String
})

const notificationSchema = new Schema({
  id: String,
  userId: String,
  title: String,
  message: String,
  type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)
const Activity = mongoose.model('Activity', activitySchema)
const Message = mongoose.model('Message', messageSchema)
const Email = mongoose.model('Email', emailSchema)
const Meeting = mongoose.model('Meeting', meetingSchema)
const Notification = mongoose.model('Notification', notificationSchema)

class DBService {
  private localData: any
  private useMongo: boolean = false

  constructor() {
    this.localData = this.loadLocal()
    this.connect()
  }

  private async connect() {
    try {
      await mongoose.connect(MONGO_URI)
      this.useMongo = true
      console.log('Premium Database (MongoDB) Connected Successfully.')
    } catch (err) {
      console.warn('MongoDB connection failed, falling back to Local high-performance JSON store.', err)
      this.useMongo = false
    }
  }

  private loadLocal(): any {
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8')
        return JSON.parse(raw)
      } catch (err) {
        return store
      }
    }
    return store
  }

  private persistLocal(data: any) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
    } catch (err) {
      console.error('Failed to persist local DB', err)
    }
  }

  public get() {
    return this.localData
  }

  public async update(updater: (data: any) => void) {
    updater(this.localData)
    this.persistLocal(this.localData)
    // In a real scenario, we would also update MongoDB here
  }

  public save() {
    this.persistLocal(this.localData)
  }
}

export const db = new DBService()
