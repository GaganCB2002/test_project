import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Employee', 'HR', 'Manager', 'Lead', 'Marketing', 'CEO'], 
    default: 'Employee' 
  },
  department: { type: String },
  avatar: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'on_leave'], default: 'active' },
  lastLogin: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model('User', userSchema);
