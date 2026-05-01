import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aurahr', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[DATABASE] MongoDB connection failed: ${error.message}. Continuing in limited mode.`);
  }
};

export default connectDB;
