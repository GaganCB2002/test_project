const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a campaign name'],
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Email', 'Social Media', 'Google Ads', 'Direct Mail', 'Other'],
    default: 'Email',
  },
  status: {
    type: String,
    enum: ['Planned', 'Active', 'Completed', 'Paused'],
    default: 'Planned',
  },
  budget: {
    type: Number,
    default: 0,
  },
  spent: {
    type: Number,
    default: 0,
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  companyId: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Campaign', CampaignSchema);
