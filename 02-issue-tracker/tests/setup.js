import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export const setupTestDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoServer.getUri());
};

export const teardownTestDatabase = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
