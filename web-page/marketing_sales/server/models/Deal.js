const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a deal title'],
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  amount: {
    type: Number,
    required: [true, 'Please add a deal amount'],
  },
  stage: {
    type: String,
    enum: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'Prospecting',
  },
  probability: {
    type: Number,
    default: 10, // Percentage
  },
  expectedCloseDate: {
    type: Date,
  },
  companyId: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Deal', DealSchema);
