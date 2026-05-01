import mongoose from 'mongoose';
import { setupMocks } from './mockManager.js';

const connectDB = async () => {
  try {
    // Attempt real connection but don't crash if it fails
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/it_helpdesk', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Warning: MongoDB Connection failed (${error.message}). Switching to mock mode...`);
    setupMocks();
  }
};

export default connectDB;
