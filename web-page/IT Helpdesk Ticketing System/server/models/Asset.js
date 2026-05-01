import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: String
});

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Asset type is required'],
    trim: true
  },
  serialNumber: {
    type: String,
    required: [true, 'Serial number is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['laptop', 'monitor', 'keyboard', 'mouse', 'headset', 'phone', 'printer', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'maintenance', 'retired'],
    default: 'available'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  purchaseDate: {
    type: Date
  },
  warrantyExpiry: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  history: [historySchema]
}, {
  timestamps: true
});

// Index for efficient querying
assetSchema.index({ serialNumber: 1 });
assetSchema.index({ status: 1 });
assetSchema.index({ assignedTo: 1 });

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
