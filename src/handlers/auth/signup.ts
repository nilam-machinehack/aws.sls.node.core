import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { HttpStatusCodes } from '../../utils/constants';
import { IUser } from '../../interfaces/auth/user';
import { createUser } from '../../service/auth/auth';
import { sendResponse, validationCheck } from '../../utils/helpers';
import { IValidationCheck } from '../../interfaces/misc/helper';
import { UserSignupDTO } from '../../dtos/auth';

/**
 * @description handler function to handle user signup
 * @param {APIGatewayEvent} event api gateway event for the lambda
 * @param {Context} context object containing runtime information of
 * lambda execution environment
 */
const signUp = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const validationResponse: IValidationCheck = await validationCheck(UserSignupDTO, event.body);

    if (!validationResponse.validated) return sendResponse(HttpStatusCodes.BAD_REQUEST, { message: validationResponse.error });

    const userData: IUser = JSON.parse(JSON.stringify(event.body));

    await createUser(userData);

    return sendResponse(HttpStatusCodes.CREATED, {
      message: 'success',
      lambda: context.functionName,
      data: { name: userData.name, email: userData.email },
    });
  } catch (error) {
    if (error?.code === 11000) return sendResponse(HttpStatusCodes.CONFLICT, { message: 'user already exists' });
    return sendResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, { message: 'exception', error });
  }
};

export const handler = middy(signUp).use(httpJsonBodyParser());
