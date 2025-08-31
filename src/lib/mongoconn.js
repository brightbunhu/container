import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/kesa-container';

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = MONGODB_URI;
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI!);
}