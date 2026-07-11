import request from "supertest";
import type { Express } from "express";
import { registerServiceMocks, authServicesMock } from "../helpers/mockModules.ts";
import { authCookie } from "../helpers/authToken.ts";

registerServiceMocks();

let app: Express;

beforeAll(async () => {
  const { loadApp } = await import("../helpers/loadApp.ts");
  app = await loadApp();
});

describe("GET /api/v1/auth/me", () => {
  it("returns 401 when no access token cookie is present", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.status).toBe(401);
  });

  it("returns 200 with the authenticated user", async () => {
    const res = await request(app).get("/api/v1/auth/me").set("Cookie", authCookie());

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("test@example.com");
  });
});

describe("POST /api/v1/auth/verify/send", () => {
  it("returns 401 without authentication", async () => {
    const res = await request(app).post("/api/v1/auth/verify/send");

    expect(res.status).toBe(401);
  });

  it("returns 200 when verification code is sent", async () => {
    authServicesMock.verifyEmail.mockResolvedValueOnce(undefined);

    const res = await request(app).post("/api/v1/auth/verify/send").set("Cookie", authCookie());

    expect(res.status).toBe(200);
    expect(authServicesMock.verifyEmail).toHaveBeenCalledWith("test@example.com");
  });
});

describe("POST /api/v1/auth/verify/confirm", () => {
  it("returns 400 when code is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/verify/confirm")
      .set("Cookie", authCookie())
      .send({});

    expect(res.status).toBe(400);
  });

  it("returns 200 when the code is verified", async () => {
    authServicesMock.emailVerified.mockResolvedValueOnce({ accessToken: "new-token" });

    const res = await request(app)
      .post("/api/v1/auth/verify/confirm")
      .set("Cookie", authCookie())
      .send({ code: "123456" });

    expect(res.status).toBe(200);
  });
});

describe("POST /api/v1/auth/token/refresh", () => {
  it("returns 401 when no refresh token cookie is present", async () => {
    const res = await request(app).post("/api/v1/auth/token/refresh");

    expect(res.status).toBe(401);
  });

  it("returns 200 with a new access token", async () => {
    authServicesMock.refreshAccessToken.mockResolvedValueOnce({ accessToken: "new-access" });

    const res = await request(app)
      .post("/api/v1/auth/token/refresh")
      .set("Cookie", "refreshToken=some-refresh-token");

    expect(res.status).toBe(200);
  });
});
