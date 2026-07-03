import type { thttpError } from "../types/types.js";
import type { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../constants/messages.ts";
import logger from "../utils/logger.ts";

const isHttpError = (err: unknown): err is thttpError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "success" in err &&
    (err as thttpError).success === false &&
    "status" in err &&
    "message" in err
  );
};

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = isHttpError(err) ? err.status : 500;
  const message = isHttpError(err)
    ? err.message
    : err instanceof Error
      ? err.message
      : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  logger.error(message, {
    status,
    request: {
      ip: req.ip || "",
      method: req.method || "",
      url: req.url || "",
    },
    trace: err instanceof Error ? { stack: err.stack } : isHttpError(err) ? err.trace : null,
  });

  const response = {
    success: false,
    status,
    message,
  };

  return res.status(status).json(response);
};
