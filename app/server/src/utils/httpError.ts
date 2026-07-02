import type { thttpError } from "../types/types.js";
import type { Request, NextFunction } from "express";
import logger from "./logger.ts";

export const httpError = (
  next: NextFunction,
  req: Request,
  status: number,
  message: string,
  data?: unknown,
  trace?: object | null,
) => {
  logger.error("HTTP Error", {
    status,
    message,
    request: {
      ip: req.ip || "",
      method: req.method || "",
      url: req.url || "",
    },
    data,
    trace: trace ?? null,
  });

  const response: thttpError = {
    success: false,
    status,
    message,
  };

  return next(response);
};
