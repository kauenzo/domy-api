import { config as loadEnv } from 'dotenv';

loadEnv();

export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? '',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
};
