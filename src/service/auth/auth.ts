import { userModel } from '../../models/auth/user';
import { IUser } from '../../interfaces/auth/user';
import { connectToMongo } from '../../configs/db';

/**
 * @description service method to insert user doc into DB
 */
export const createUser = connectToMongo(async (userData: IUser): Promise<IUser> => {
  return await userModel.create(userData);
});
