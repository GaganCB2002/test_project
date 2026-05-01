const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    deviceType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Index for faster history lookups and geospatial queries if needed later
locationSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Location', locationSchema);
