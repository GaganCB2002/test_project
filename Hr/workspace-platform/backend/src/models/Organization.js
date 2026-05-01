const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String },
  website: { type: String },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  settings: {
    allowGuestMessages: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: false },
    maxUsers: { type: Number, default: 100 }
  },
  billing: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    stripeCustomerId: { type: String },
    subscriptionStatus: { type: String }
  },
  isActive: { type: Boolean, default: true },
  departments: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);