import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { HttpStatusCodes } from '../../utils/constants';
import { IUser } from '../../interfaces/auth/user';
import { findUser } from '../../service/auth/auth';
import { bcryptHelpers, jwtHelpers, sendResponse } from '../../utils/helpers';

/**
 * @description handler function to handle user signin
 * @param {APIGatewayEvent} event api gateway event for the lambda
 * @param {Context} context object containing runtime information of
 * lambda execution environment
 */
const signIn = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const userData: { email: string; password: string } = JSON.parse(JSON.stringify(event.body));

    const user: IUser = await findUser({ email: userData.email });

    if (!user) return sendResponse(HttpStatusCodes.NOT_FOUND, { message: 'user not found' });

    const passwordValidation: boolean = await bcryptHelpers.comparePasswords(userData.password, user.password);

    if (!passwordValidation) return sendResponse(HttpStatusCodes.BAD_REQUEST, { message: 'incorrect password' });

    const token: string = jwtHelpers.createToken({ userId: user._id, email: userData.email });

    return sendResponse(HttpStatusCodes.OK, { message: 'success', lambda: context.functionName, data: { token } });
  } catch (error) {
    return sendResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, { message: 'exception', error });
  }
};

export const handler = middy(signIn).use(httpJsonBodyParser());
