import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  fileName: string;
  fileType: string;
  size: number;
  url: string;
  uploadedBy: string;
  department?: string;
  isPublic: boolean;
  allowedRoles?: string[];
  createdAt: Date;
}

const FileSchema: Schema = new Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  department: { type: String },
  isPublic: { type: Boolean, default: false },
  allowedRoles: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IFile>('File', FileSchema);
