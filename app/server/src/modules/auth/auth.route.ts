import {
  creatUserController,
  signInUserController,
  signOutUserController,
  sendVerificationCodeController,
  verifyEmailController,
  refreshAccessTokenController,
} from "./auth.controller.ts";
import router from "express";
import { authenticate } from "../../middlewares/auth.middleware.ts";
import { getMeController } from "./auth.controller.ts";
import { rateLimit } from "express-rate-limit";
import { ERROR_MESSAGES } from "../../constants/messages.ts";
import type { thttpError } from "../../types/types.ts";
import logger from "../../utils/logger.ts";
import { getRetryAfterSeconds } from "../../utils/rateLimitRetryAfter.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { signupSchema, signinSchema } from "./auth.schema.ts";

export const authRouter = router.Router();

const rateLimitHandler: NonNullable<Parameters<typeof rateLimit>[0]>["handler"] = (req, res) => {
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
};

// Signup: high abuse/spam risk (account + downstream email costs) — keep tight.
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler,
});

// Signin: legitimate users retry (typos, multiple devices/tabs) far more than 10 times/15min.
const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler,
});

// Verification code send: triggers an email/SMS send, so keep strict to control cost/spam.
const verifySendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler,
});

// Verification code confirm: users may mistype the code a few times before it expires.
const verifyConfirmLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler,
});

// Token refresh: called silently/frequently by clients to keep sessions alive, low abuse risk.
const tokenRefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler,
});

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/signup", signupLimiter, validate(signupSchema), creatUserController);

/**
 * @openapi
 * /api/v1/auth/signin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SigninRequest'
 *     responses:
 *       200:
 *         description: Signed in successfully (tokens set as httpOnly cookies)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/signin", signinLimiter, validate(signinSchema), signInUserController);

/**
 * @openapi
 * /api/v1/auth/signout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign out the current user
 *     responses:
 *       200:
 *         description: Signed out successfully (cookies cleared)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/signout", signOutUserController);

authRouter.post("/token/refresh", tokenRefreshLimiter, refreshAccessTokenController);
authRouter.post("/verify/send", authenticate, verifySendLimiter, sendVerificationCodeController);
authRouter.post("/verify/confirm", authenticate, verifyConfirmLimiter, verifyEmailController);

authRouter.get("/me", authenticate, getMeController);
