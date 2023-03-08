import mongoose from 'mongoose';

export const connectDB = async () => {
  if (!process.env.DB_URL) {
    throw new Error('Database URL(DB_URL) is not define in .env config');
  }

  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_URL);
  } catch (error: unknown) {
    setTimeout(connectDB, 5000);
  }
};
