import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { HttpStatusCodes } from '../../utils/constants';
import { IUser } from '../../interfaces/auth/user';
import { createUser } from '../../service/auth/auth';

/**
 * @description handler function to handle user signup
 * @param {APIGatewayEvent} event api gateway event for the lambda
 * @param {Context} context object containing runtime information of
 * lambda execution environment
 */
const signUp = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const userData: IUser = JSON.parse(JSON.stringify(event.body));

    await createUser(userData);

    return {
      statusCode: HttpStatusCodes.OK,
      body: JSON.stringify({ message: 'success', lambda: context.functionName, data: { name: userData.name, email: userData.email } }),
    };
  } catch (error) {
    return {
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: 'exception', error }),
    };
  }
};

export const handler = middy(signUp).use(httpJsonBodyParser());
