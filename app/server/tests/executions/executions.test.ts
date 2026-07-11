import request from "supertest";
import type { Express } from "express";
import { registerServiceMocks, executionServicesMock } from "../helpers/mockModules.ts";
import { authCookie } from "../helpers/authToken.ts";

registerServiceMocks();

let app: Express;

beforeAll(async () => {
  const { loadApp } = await import("../helpers/loadApp.ts");
  app = await loadApp();
});

describe("GET /api/v1/workflows/workflows/:workflowId/executions", () => {
  it("returns 401 without authentication", async () => {
    const res = await request(app).get("/api/v1/workflows/workflows/1/executions");
    expect(res.status).toBe(401);
  });

  it("returns 400 for a non-numeric workflow id", async () => {
    const res = await request(app)
      .get("/api/v1/workflows/workflows/abc/executions")
      .set("Cookie", authCookie());

    expect(res.status).toBe(400);
  });

  it("returns 200 with the executions list", async () => {
    executionServicesMock.getExecutionsForWorkflow.mockResolvedValueOnce([
      { id: 1, workflowId: 1, status: "completed" },
    ]);

    const res = await request(app)
      .get("/api/v1/workflows/workflows/1/executions")
      .set("Cookie", authCookie());

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("returns 403 when the user does not own the workflow", async () => {
    executionServicesMock.getExecutionsForWorkflow.mockResolvedValueOnce(
      new Error("You do not have permission to update this workflow"),
    );

    const res = await request(app)
      .get("/api/v1/workflows/workflows/1/executions")
      .set("Cookie", authCookie());

    expect(res.status).toBe(403);
  });
});

describe("GET /api/v1/workflows/workflows/:workflowId/executions/latest", () => {
  it("returns 200 with the latest execution", async () => {
    executionServicesMock.getLatestExecutionForWorkflow.mockResolvedValueOnce({
      id: 2,
      workflowId: 1,
      status: "running",
    });

    const res = await request(app)
      .get("/api/v1/workflows/workflows/1/executions/latest")
      .set("Cookie", authCookie());

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(2);
  });

  it("returns 404 when the workflow does not exist", async () => {
    executionServicesMock.getLatestExecutionForWorkflow.mockResolvedValueOnce(
      new Error("Workflow not found"),
    );

    const res = await request(app)
      .get("/api/v1/workflows/workflows/1/executions/latest")
      .set("Cookie", authCookie());

    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/workflows/workflows/:workflowId/executions/:executionId", () => {
  it("returns 400 for a non-numeric execution id", async () => {
    const res = await request(app)
      .get("/api/v1/workflows/workflows/1/executions/abc")
      .set("Cookie", authCookie());

    expect(res.status).toBe(400);
  });

  it("returns 200 with the execution detail", async () => {
    executionServicesMock.getExecutionDetail.mockResolvedValueOnce([
      { id: 1, nodeId: "node-1", status: "completed" },
    ]);

    const res = await request(app)
      .get("/api/v1/workflows/workflows/1/executions/5")
      .set("Cookie", authCookie());

    expect(res.status).toBe(200);
  });
});
