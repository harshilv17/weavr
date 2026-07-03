import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import { httpError } from "../utils/httpError.ts";
import { ERROR_MESSAGES } from "../constants/messages.ts";
import { config } from "../config/config.ts";

const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "x-xsrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const issueCsrfCookie = (res: Response): string => {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: config.isProduction,
    sameSite: config.isProduction ? "strict" : "lax",
  });
  return token;
};

// Double-submit cookie CSRF protection: a readable cookie is echoed back as a
// header by the client (axios does this automatically for XSRF-TOKEN/x-xsrf-token).
// A cross-site page can trigger the cookie to be sent but cannot read it to set the header.
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const cookieToken = req.cookies?.[CSRF_COOKIE] as string | undefined;

  if (SAFE_METHODS.has(req.method)) {
    if (!cookieToken) {
      issueCsrfCookie(res);
    }
    return next();
  }

  const headerToken = req.headers[CSRF_HEADER] as string | undefined;

  if (
    !cookieToken ||
    !headerToken ||
    cookieToken.length !== headerToken.length ||
    !crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))
  ) {
    return httpError(next, req, 403, ERROR_MESSAGES.CSRF_TOKEN_INVALID);
  }

  return next();
};
