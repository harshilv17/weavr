import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { ERROR_MESSAGES } from "../constants/messages.ts";
import type { thttpError } from "../types/types.ts";
import logger from "../utils/logger.ts";
import { getRetryAfterSeconds } from "../utils/rateLimitRetryAfter.ts";

export const runWorkflowRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // max 30 workflow runs per user per minute
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) =>
    req.user?.userId?.toString() ?? (req.ip ? ipKeyGenerator(req.ip) : "unknown"),
  handler: (req, res) => {
    logger.warn(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED, {
      status: 429,
      request: {
        ip: req.ip || "",
        method: req.method || "",
        url: req.url || "",
      },
    });

    const retryAfter = getRetryAfterSeconds(req);

    const response: thttpError = {
      success: false,
      status: 429,
      message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      retryAfter,
    };
    res.set("Retry-After", String(retryAfter));
    res.status(429).json(response);
  },
});
