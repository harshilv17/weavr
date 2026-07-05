import bcrypt from "bcryptjs";
import { users } from "../../db/schemas/user.schema.ts";
import { db } from "../../config/db.ts";
import { getUserByEmail } from "./auth.repo.ts";
import { eq } from "drizzle-orm";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/tokens.ts";
import { ERROR_MESSAGES } from "../../constants/messages.ts";
import { client } from "../../config/redis.ts";
import { addVerificationEmailJob } from "../../jobs/verificationEmail.job.ts";

export const createUser = async (name: string, email: string, password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return err;
  }
};

export const signOutUser = async (userId: number) => {
  try {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, userId));
  } catch (err) {
    return err;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const user = await getUserByEmail(email);
    if (user === null) {
      return new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email,
      name: user.name,
      isVerified: user.isVerified,
    });
    const refreshToken = generateRefreshToken({ userId: user.id, email, name: user.name });

    await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));
    const isVerified = user.isVerified;

    return { accessToken, refreshToken, isVerified } as {
      accessToken: string;
      refreshToken: string;
      isVerified: boolean;
    };
  } catch (err) {
    return err;
  }
};

export const verifyEmail = async (email: string) => {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await client.set(`email_verificationcode:${email}`, code, {
      EX: 60 * 10,
    });
    await addVerificationEmailJob({ email, code });
  } catch (err) {
    return err;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await getUserByEmail(payload.email);
    if (!user) {
      return new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    if (user.refreshToken !== refreshToken) {
      return new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
    });
    return { accessToken };
  } catch (err) {
    return err;
  }
};

export const emailVerified = async (email: string, code: string) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const redisCode = await client.get(`email_verificationcode:${email}`);
    if (redisCode === null) {
      return new Error(ERROR_MESSAGES.VERIFICATION_CODE_EXPIRED);
    }

    if (redisCode !== code) {
      return new Error(ERROR_MESSAGES.INVALID_VERIFICATION_CODE);
    }

    await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));
    await client.del(`email_verificationcode:${email}`);

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      isVerified: true,
    });
    return { accessToken };
  } catch (err) {
    return err;
  }
};
