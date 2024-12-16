import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { JWT_SECRET } from '../configs/env';
import { IValidationCheck } from '../interfaces/misc/helper';

/**
 * @description bcrypt helper methods to generate hash salt, to hash a plaintext password and to compare passwords
 */
export const bcryptHelpers = {
  getHashSalt: async (): Promise<string> => {
    return await bcrypt.genSalt();
  },
  hashPlaintextPassword: async (plaintextPassword: string): Promise<string> => {
    const salt: string = await bcryptHelpers.getHashSalt();
    const hashedPassword: string = await bcrypt.hash(plaintextPassword, salt);
    return hashedPassword;
  },
  comparePasswords: async (plaintextPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
  },
};

/**
 * @description jwt helper methods to create jwt token and to verify a given jwt token
 */
export const jwtHelpers = {
  createToken: (payload: any, expiry: number = 3 * 24 * 60 * 60): string => jwt.sign(payload, JWT_SECRET, { expiresIn: expiry }),
  verifyToken: (token: string): jwt.JwtPayload | string => jwt.verify(token, JWT_SECRET),
};

/**
 * @description helper method responsible for
 * sending lambda response back to client
 * @param {number} statusCode http status code
 * @param {any} body body of the lambda response
 * @returns the lambda response
 */
export const sendResponse = (statusCode: number, body: any) => ({ statusCode, body: JSON.stringify(body) });

/**
 * @description validation check for the lambda's event body
 * @param {any} dtoForValidation dto for validation of event body
 * @param {any} eventBody lambda's event body to be validated
 * @param {boolean} skipMissingProperties boolean to confirm whether to skip missing properties
 * @param {boolean} whitelist boolean to confirm whether to allow other properties than described in dto
 * @param {boolean} forbidNonWhitelisted boolean to confirm whether to have an error thrown when any non-whitelisted properties are present
 */
export const validationCheck = async (
  dtoForValidation: any,
  eventBody: any,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
): Promise<IValidationCheck> => {
  const dto = plainToInstance(dtoForValidation, eventBody);
  const validatePromiseResponse: PromiseSettledResult<any>[] = await Promise.allSettled([
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted }),
  ]);
  const validateResponse: PromiseSettledResult<any> = validatePromiseResponse[0];
  const validationResponse: IValidationCheck = { validated: false, error: null };

  if (validateResponse.status === 'fulfilled') validationResponse.validated = true;
  else validationResponse.error = validateResponse.reason.map((error: ValidationError) => Object.values(error.constraints)).join(', and ');

  return validationResponse;
};
