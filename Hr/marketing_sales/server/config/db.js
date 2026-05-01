const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Set a timeout for the connection
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_dashboard', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Running in Mock Mode (No Database Persistence)');
    // In a real app, we'd handle this more gracefully, but for a POC/Dashboard demo, 
    // we allow it to continue so the user can see the UI.
  }
};

module.exports = connectDB;
