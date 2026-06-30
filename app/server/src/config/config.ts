import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || (3000 as number),

  //Database Configuration
  DatabaseUrl: process.env.DATABASE_URL as string,

  //JWT Configurations
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",

  //smtp
  smtpHost: process.env.SMTP_HOST as string,
  smtpPort: process.env.SMTP_PORT as string,
  smtpUser: process.env.SMTP_USER as string,
  smtpPass: process.env.SMTP_PASS as string,
  smtpSecure: process.env.SMTP_SECURE === "true",

  //redis
  redisUrl: process.env.REDIS_URL as string,

  //credential encryption
  credentialEncryptionKey: process.env.CREDENTIAL_ENCRYPTION_KEY as string,

  //env
  isProduction: process.env.NODE_ENV === "production",
};
