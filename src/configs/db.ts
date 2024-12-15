import mongoose from 'mongoose';
import { DB_URI } from './env';

/**
 * @description method responsible for establishing mongoose connection
 * if not already established
 */
const ensureMongooseConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(DB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
  }
};

/**
 * @description method responsible for ensuring healthy mongoose connection
 * and then execution of the db operation provided
 * @param {any} dbOperation db operation to be executed
 */
export const connectToMongo =
  (dbOperation: any) =>
  async (...args: any): Promise<any> => {
    await ensureMongooseConnection();
    return dbOperation(...args);
  };
