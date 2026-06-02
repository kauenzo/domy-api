const requiredEnvKeys = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'ADMIN_GOOGLE_CALLBACK_URL',
] as const;

export const validateEnvironment = (): void => {
  const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Variaveis de ambiente ausentes: ${missingKeys.join(', ')}`,
    );
  }
};
