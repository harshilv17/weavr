import jwt from "jsonwebtoken";

export const TEST_USER = {
  userId: 1,
  email: "test@example.com",
  name: "Test User",
  isVerified: true,
};

export function signAccessToken(payload: Partial<typeof TEST_USER> = {}): string {
  return jwt.sign({ ...TEST_USER, ...payload }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
}

export function authCookie(payload: Partial<typeof TEST_USER> = {}): string {
  return `accessToken=${signAccessToken(payload)}`;
}
