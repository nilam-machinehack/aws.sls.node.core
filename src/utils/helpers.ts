import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env';
import bcrypt from 'bcryptjs';

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
