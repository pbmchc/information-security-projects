import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DB);
  } catch (err) {
    console.error(err instanceof Error ? err.message : 'Error while connecting to database');
    process.exit(1);
  }
};
