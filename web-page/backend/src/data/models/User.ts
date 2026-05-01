import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../types';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  employeeId: string;
  avatar?: string;
  department?: string;
  lastLogin?: Date;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  employeeId: { type: String, required: true },
  avatar: { type: String },
  department: { type: String },
  lastLogin: { type: Date },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
