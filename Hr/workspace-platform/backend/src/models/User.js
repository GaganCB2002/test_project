const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  googleId: { type: String },
  role: {
    type: String,
    enum: ['CEO', 'Manager', 'HR', 'Employee', 'Intern'],
    default: 'Employee'
  },
  department: {
    type: String,
    enum: ['HR', 'IT', 'Marketing', 'Sales', 'Finance', 'Operations'],
    default: 'Employee'
  },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginHistory: [{
    date: { type: Date },
    ip: { type: String },
    device: { type: String }
  }],
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    lastUpdated: { type: Date }
  },
  trackingActive: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);