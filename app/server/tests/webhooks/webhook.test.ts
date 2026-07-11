import request from "supertest";
import type { Express } from "express";
import {
  registerServiceMocks,
  executorServicesMock,
  workflowExecutionJobMock,
} from "../helpers/mockModules.ts";

registerServiceMocks();

let app: Express;

beforeAll(async () => {
  const { loadApp } = await import("../helpers/loadApp.ts");
  app = await loadApp();
});

describe("POST /api/v1/webhooks/:token", () => {
  it("returns 404 when the webhook token is unknown", async () => {
    executorServicesMock.resolveWebhookTrigger.mockResolvedValueOnce(
      new Error("Webhook not found"),
    );

    const res = await request(app).post("/api/v1/webhooks/unknown-token").send({ foo: "bar" });

    expect(res.status).toBe(404);
  });

  it("returns 202 and queues the workflow run when the token is valid", async () => {
    executorServicesMock.resolveWebhookTrigger.mockResolvedValueOnce({
      workflowId: 1,
      userId: 1,
    });
    workflowExecutionJobMock.addWorkflowExecutionJob.mockResolvedValueOnce(undefined);

    const res = await request(app).post("/api/v1/webhooks/valid-token").send({ foo: "bar" });

    expect(res.status).toBe(202);
    expect(res.body.data.status).toBe("queued");
    expect(workflowExecutionJobMock.addWorkflowExecutionJob).toHaveBeenCalledWith(
      expect.objectContaining({ workflowId: 1, userId: 1 }),
    );
  });

  it("does not require authentication", async () => {
    executorServicesMock.resolveWebhookTrigger.mockResolvedValueOnce({
      workflowId: 2,
      userId: 3,
    });

    const res = await request(app).post("/api/v1/webhooks/no-auth-token").send({});

    expect(res.status).not.toBe(401);
  });
});
