import mongoose from 'mongoose';

// Connect to MongoDB with proper environment variables and caching
const connectDB = async (): Promise<void> => {
  // Check if there is an existing connection to avoid multiple connections
  if (mongoose.connections[0].readyState) return;

  try {
    // Use the environment variable for the MongoDB URI (fall back to local for development)
    const uri = process.env.MONGODB_URI;

    // Ensure the MongoDB URI is defined
    if (!uri) {
      throw new Error('MongoDB URI is not defined');
    }

    // Connect to MongoDB with additional options for stability
    await mongoose.connect(uri);

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw new Error('Database connection failed');
  }
};

export default connectDB;
