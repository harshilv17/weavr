import type { Request } from "express";
import type { RateLimitInfo } from "express-rate-limit";

export function getRetryAfterSeconds(req: Request): number {
  const resetTime = (req as Request & { rateLimit?: RateLimitInfo }).rateLimit?.resetTime;
  return Math.max(1, Math.ceil(((resetTime?.getTime() ?? Date.now()) - Date.now()) / 1000));
}
