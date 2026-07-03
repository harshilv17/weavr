import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens.ts";
import { httpError } from "../utils/httpError.ts";
import { ERROR_MESSAGES } from "../constants/messages.ts";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) {
    return httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return httpError(next, req, 401, ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
  }
};
