import mongoose, { Schema } from 'mongoose';

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  permissions: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);

export default Role;