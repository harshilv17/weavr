import request from "supertest";
import type { Express } from "express";
import {
  registerServiceMocks,
  executorServicesMock,
  workflowExecutionJobMock,
} from "../helpers/mockModules.ts";
import { authCookie } from "../helpers/authToken.ts";
import { csrfCookie, csrfHeader } from "../helpers/csrfToken.ts";

registerServiceMocks();

let app: Express;

beforeAll(async () => {
  const { loadApp } = await import("../helpers/loadApp.ts");
  app = await loadApp();
});

describe("POST /api/v1/workflows/workflows/:workflowId/run", () => {
  it("returns 400 for a non-numeric workflow id", async () => {
    const res = await request(app)
      .post("/api/v1/workflows/workflows/abc/run")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader());

    expect(res.status).toBe(400);
  });

  it("returns 202 and queues the run", async () => {
    executorServicesMock.buildExecutionGraph.mockResolvedValueOnce({ nodes: [], edges: [] });
    workflowExecutionJobMock.addWorkflowExecutionJob.mockResolvedValueOnce(undefined);

    const res = await request(app)
      .post("/api/v1/workflows/workflows/1/run")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader());

    expect(res.status).toBe(202);
    expect(res.body.data.status).toBe("queued");
    expect(workflowExecutionJobMock.addWorkflowExecutionJob).toHaveBeenCalledWith({
      workflowId: 1,
      userId: 1,
    });
  });

  it("returns 404 when the workflow does not exist", async () => {
    executorServicesMock.buildExecutionGraph.mockResolvedValueOnce(new Error("Workflow not found"));

    const res = await request(app)
      .post("/api/v1/workflows/workflows/1/run")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader());

    expect(res.status).toBe(404);
  });
});

describe("POST /api/v1/workflows/workflows/:workflowId/schedule/start", () => {
  it("returns 200 when the schedule is started", async () => {
    executorServicesMock.startWorkflowScheduleService.mockResolvedValueOnce({
      scheduleEnabled: true,
      scheduleIntervalSeconds: 120,
    });

    const res = await request(app)
      .post("/api/v1/workflows/workflows/1/schedule/start")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader())
      .send({ intervalSeconds: 120 });

    expect(res.status).toBe(200);
  });

  it("returns 400 when the interval is too short", async () => {
    executorServicesMock.startWorkflowScheduleService.mockResolvedValueOnce(
      new Error("Interval must be a whole number of seconds, minimum 60"),
    );

    const res = await request(app)
      .post("/api/v1/workflows/workflows/1/schedule/start")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader())
      .send({ intervalSeconds: 5 });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/v1/workflows/workflows/:workflowId/schedule/stop", () => {
  it("returns 200 when the schedule is stopped", async () => {
    executorServicesMock.stopWorkflowScheduleService.mockResolvedValueOnce({
      scheduleEnabled: false,
    });

    const res = await request(app)
      .post("/api/v1/workflows/workflows/1/schedule/stop")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader());

    expect(res.status).toBe(200);
  });

  it("returns 403 when forbidden", async () => {
    executorServicesMock.stopWorkflowScheduleService.mockResolvedValueOnce(
      new Error("You do not have permission to update this workflow"),
    );

    const res = await request(app)
      .post("/api/v1/workflows/workflows/1/schedule/stop")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader());

    expect(res.status).toBe(403);
  });
});
