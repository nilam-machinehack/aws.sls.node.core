import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { HttpStatusCodes } from '../../utils/constants';
import { sendResponse } from '../../utils/helpers';

/**
 * @description handler function for api health check
 * @param {APIGatewayEvent} event api gateway event for the lambda
 * @param {Context} context object containing runtime information of
 * lambda execution environment
 */
const ping = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  return sendResponse(HttpStatusCodes.OK, { message: 'pong!', lambda: context.functionName, stage: event?.requestContext?.stage || 'dev' });
};

export const handler = middy(ping).use(httpJsonBodyParser());
