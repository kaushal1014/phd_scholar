import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw new Error('Database connection failed');
  }
};

export default connectDB;
