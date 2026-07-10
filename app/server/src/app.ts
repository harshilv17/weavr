import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/auth.route.ts";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.ts";
import { swaggerSpec } from "./config/swagger.ts";
import { workflowRouter } from "./modules/workflows/workflow.route.ts";
import { executionRouter } from "./modules/executions/execution.route.ts";
import { webhookRouter } from "./modules/executions/webhook.route.ts";
import { authenticate } from "./middlewares/auth.middleware.ts";
import { csrfProtection } from "./middlewares/csrf.middleware.ts";
import cookieParser from "cookie-parser"; // Import cookie-parser

import { rateLimit } from "express-rate-limit";
import { ERROR_MESSAGES } from "./constants/messages.ts";
import type { thttpError } from "./types/types.ts";
import logger from "./utils/logger.ts";
import { getRetryAfterSeconds } from "./utils/rateLimitRetryAfter.ts";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3000, // Limit each IP to 3000 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
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

const app = express();

app.use(limiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser()); // Add this line to parse cookies
app.use(express.urlencoded({ extended: true }));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Webhooks are called by external services (no browser/cookies involved), so CSRF doesn't apply.
app.use("/api/v1/webhooks", webhookRouter);

// Auth routes are exempt: signup/signin/token-refresh happen before any CSRF
// cookie exists, and they're protected by credentials (password/refresh token)
// rather than an ambient session cookie.
app.use("/api/v1/auth", authRouter);

app.use(csrfProtection);

app.use("/api/v1/workflows", authenticate, workflowRouter);
app.use("/api/v1/workflows", authenticate, executionRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
