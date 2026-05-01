import mongoose from 'mongoose';

const trackingLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export const TrackingLog = mongoose.model('TrackingLog', trackingLogSchema);
