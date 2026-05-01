import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  employeeId?: string;
  avatar?: string;
  department?: string;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, default: 'Employee' },
  employeeId: { type: String },
  avatar: { type: String },
  department: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
