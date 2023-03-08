import mongoose from 'mongoose';

const RECONNECT_TIMEOUT = 5 * 1000;

export const connectDB = async () => {
  if (!process.env.DB_URL) {
    throw new Error('Database URL(DB_URL) is not define in .env config');
  }

  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_URL);
  } catch (error: unknown) {
    setTimeout(connectDB, RECONNECT_TIMEOUT);
  }
};
