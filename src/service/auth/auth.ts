import { userModel } from '../../models/auth/user';
import { IUser } from '../../interfaces/auth/user';
import { connectToMongo } from '../../configs/db';
import { FilterQuery } from 'mongoose';

/**
 * @description service method to insert user doc into DB
 */
export const createUser = connectToMongo(async (userData: IUser): Promise<IUser> => {
  return await userModel.create(userData);
});

/**
 * @description service method to fetch a user doc from DB
 */
export const findUser = connectToMongo(async (filterQuery: FilterQuery<IUser>, projectQuery: object = { __v: 0 }): Promise<IUser> => {
  return await userModel.findOne(filterQuery, projectQuery).lean();
});
