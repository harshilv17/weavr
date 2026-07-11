import request from "supertest";
import type { Express } from "express";
import { registerServiceMocks, authServicesMock } from "../helpers/mockModules.ts";

registerServiceMocks();

let app: Express;

beforeAll(async () => {
  const { loadApp } = await import("../helpers/loadApp.ts");
  app = await loadApp();
});

describe("POST /api/v1/auth/signin", () => {
  it("returns 400 when email or password is missing", async () => {
    const res = await request(app).post("/api/v1/auth/signin").send({ email: "a@b.com" });

    expect(res.status).toBe(400);
  });

  it("returns 200 and sets cookies on success", async () => {
    authServicesMock.signInUser.mockResolvedValueOnce({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      isVerified: true,
    });

    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({ email: "john@example.com", password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isVerified).toBe(true);
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.join(";")).toContain("accessToken=");
    expect(cookies.join(";")).toContain("refreshToken=");
  });

  it("returns 401 for invalid credentials", async () => {
    authServicesMock.signInUser.mockResolvedValueOnce(new Error("Invalid password"));

    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({ email: "john@example.com", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid password");
  });
});

describe("POST /api/v1/auth/signout", () => {
  it("clears cookies and returns 200", async () => {
    const res = await request(app).post("/api/v1/auth/signout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
