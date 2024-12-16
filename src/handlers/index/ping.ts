import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { HttpStatusCodes } from '../../utils/constants';

/**
 * @description handler function for api health check
 * @param {APIGatewayEvent} event api gateway event for the lambda
 * @param {Context} context object containing runtime information of
 * lambda execution environment
 */
const ping = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: HttpStatusCodes.OK,
    body: JSON.stringify({ message: 'pong!', lambda: context.functionName, event }),
  };
};

export const handler = middy(ping).use(httpJsonBodyParser());
