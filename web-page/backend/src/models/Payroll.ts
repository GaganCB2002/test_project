import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employeeId: string;
  employeeName: string;
  month: string; // e.g., "Apr 2026"
  department: string;
  bankStatus: 'Processed' | 'Queued' | 'Pending' | 'Failed';
  breakdown: {
    basic: number;
    hra: number;
    specialAllowance: number;
    bonus: number;
    pf: number;
    esi: number;
    tds: number;
    reimbursements: number;
    net: number;
  };
}

const PayrollSchema: Schema = new Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  month: { type: String, required: true },
  department: { type: String, required: true },
  bankStatus: { type: String, enum: ['Processed', 'Queued', 'Pending', 'Failed'], default: 'Queued' },
  breakdown: {
    basic: { type: Number, required: true },
    hra: { type: Number, required: true },
    specialAllowance: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },
    esi: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },
    reimbursements: { type: Number, default: 0 },
    net: { type: Number, required: true }
  }
}, { timestamps: true });

PayrollSchema.index({ employeeId: 1, month: 1 }, { unique: true });

export default mongoose.model<IPayroll>('Payroll', PayrollSchema);
