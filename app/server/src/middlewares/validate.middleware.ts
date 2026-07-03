import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { httpError } from "../utils/httpError.ts";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request body";
    return httpError(next, req, 400, message);
  }

  req.body = result.data;
  return next();
};
