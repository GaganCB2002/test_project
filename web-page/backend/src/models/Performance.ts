import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformance extends Document {
  employeeId: string;
  employeeName: string;
  goalCompletion: number;
  kpiScore: number;
  reviewScore: number;
  feedback360: number;
  promotionReadiness: 'High' | 'Medium' | 'Low';
  strengths: string[];
  coachNotes: string;
  reviewCycle: string; // e.g., "Q1 2026"
}

const PerformanceSchema: Schema = new Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  goalCompletion: { type: Number, required: true },
  kpiScore: { type: Number, required: true },
  reviewScore: { type: Number, required: true },
  feedback360: { type: Number, required: true },
  promotionReadiness: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  strengths: [{ type: String }],
  coachNotes: { type: String },
  reviewCycle: { type: String, required: true }
}, { timestamps: true });

PerformanceSchema.index({ employeeId: 1, reviewCycle: 1 }, { unique: true });

export default mongoose.model<IPerformance>('Performance', PerformanceSchema);
