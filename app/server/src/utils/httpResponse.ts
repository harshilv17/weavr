import type { thttpResponse } from "../types/types.js";
import type { Request, Response } from "express";
import logger from "./logger.ts";

export const httpResponse = (
  res: Response,
  req: Request,
  status: number,
  message: string,
  data?: unknown,
) => {
  logger.info("HTTP Response", {
    status,
    message,
    request: {
      ip: req.ip || "",
      method: req.method || "",
      url: req.url || "",
    },
    data,
  });

  const response: thttpResponse = {
    success: true,
    status,
    message,
    data,
  };

  return res.status(status).json(response);
};
