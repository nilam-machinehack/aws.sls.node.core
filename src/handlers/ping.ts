import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

const ping = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log('event received: ', event);
  console.log('context received: ', context);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'pong!' }),
  };
};

export const handler = middy(ping).use(httpJsonBodyParser());
