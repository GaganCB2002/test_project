import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  level: string;
  location: string;
  employmentType: string;
  joinDate: string;
  managerId?: string;
  compensation: number;
  engagementScore: number;
  performanceRating: number;
  attritionRisk: number;
  status: 'Active' | 'Notice Period' | 'Terminated';
  documents: string[];
  skills: string[];
}

const EmployeeSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, required: true },
  location: { type: String, required: true },
  employmentType: { type: String, required: true },
  joinDate: { type: String, required: true },
  managerId: { type: String },
  compensation: { type: Number, required: true },
  engagementScore: { type: Number, default: 0 },
  performanceRating: { type: Number, default: 0 },
  attritionRisk: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Notice Period', 'Terminated'], default: 'Active' },
  documents: [{ type: String }],
  skills: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
