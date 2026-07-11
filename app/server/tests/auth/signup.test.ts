import request from "supertest";
import type { Express } from "express";
import { registerServiceMocks, authServicesMock } from "../helpers/mockModules.ts";

registerServiceMocks();

let app: Express;

beforeAll(async () => {
  const { loadApp } = await import("../helpers/loadApp.ts");
  app = await loadApp();
});

describe("POST /api/v1/auth/signup", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({ email: "a@b.com" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 201 when user is created successfully", async () => {
    authServicesMock.createUser.mockResolvedValueOnce(undefined);

    const res = await request(app).post("/api/v1/auth/signup").send({
      username: "johndoe",
      email: "john@example.com",
      password: "Secret123!",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(authServicesMock.createUser).toHaveBeenCalledWith(
      "johndoe",
      "john@example.com",
      "Secret123!",
    );
  });

  it("returns 400 when the user already exists", async () => {
    authServicesMock.createUser.mockResolvedValueOnce(new Error("User already exists"));

    const res = await request(app).post("/api/v1/auth/signup").send({
      username: "johndoe",
      email: "john@example.com",
      password: "Secret123!",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("returns 500 when the service throws unexpectedly", async () => {
    authServicesMock.createUser.mockRejectedValueOnce(new Error("boom"));

    const res = await request(app).post("/api/v1/auth/signup").send({
      username: "johndoe",
      email: "john@example.com",
      password: "Secret123!",
    });

    expect(res.status).toBe(500);
  });
});
