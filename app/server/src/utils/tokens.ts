import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

export type TokenPayload = {
  userId: number;
  email: string;
  name: string;
  isVerified?: boolean;
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiry,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiry,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.accessTokenSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.refreshTokenSecret) as TokenPayload;
};
