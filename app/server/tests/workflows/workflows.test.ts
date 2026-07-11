import request from "supertest";
import type { Express } from "express";
import { registerServiceMocks, workflowServicesMock } from "../helpers/mockModules.ts";
import { authCookie } from "../helpers/authToken.ts";
import { csrfCookie, csrfHeader } from "../helpers/csrfToken.ts";

registerServiceMocks();

let app: Express;

beforeAll(async () => {
  const { loadApp } = await import("../helpers/loadApp.ts");
  app = await loadApp();
});

const sampleWorkflow = {
  id: 1,
  userId: 1,
  name: "My Workflow",
  description: "Automates data processing",
  status: "draft",
};

describe("GET /api/v1/workflows/workflows", () => {
  it("returns 401 without authentication", async () => {
    const res = await request(app).get("/api/v1/workflows/workflows");
    expect(res.status).toBe(401);
  });

  it("returns 200 with the user's workflows", async () => {
    workflowServicesMock.getUserWorkflows.mockResolvedValueOnce([sampleWorkflow]);

    const res = await request(app).get("/api/v1/workflows/workflows").set("Cookie", authCookie());

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([sampleWorkflow]);
    expect(workflowServicesMock.getUserWorkflows).toHaveBeenCalledWith(1);
  });
});

describe("GET /api/v1/workflows/workflows/:workflowId", () => {
  it("returns 400 for a non-numeric workflow id", async () => {
    const res = await request(app)
      .get("/api/v1/workflows/workflows/abc")
      .set("Cookie", authCookie());

    expect(res.status).toBe(400);
  });

  it("returns 404 when the workflow does not exist", async () => {
    workflowServicesMock.getWorkflow.mockResolvedValueOnce(new Error("Workflow not found"));

    const res = await request(app)
      .get("/api/v1/workflows/workflows/99")
      .set("Cookie", authCookie());

    expect(res.status).toBe(404);
  });

  it("returns 200 with the workflow", async () => {
    workflowServicesMock.getWorkflow.mockResolvedValueOnce(sampleWorkflow);

    const res = await request(app).get("/api/v1/workflows/workflows/1").set("Cookie", authCookie());

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(sampleWorkflow);
  });
});

describe("POST /api/v1/workflows/workflows", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/v1/workflows/workflows")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader())
      .send({ name: "Only name" });

    expect(res.status).toBe(400);
  });

  it("returns 201 when the workflow is created", async () => {
    workflowServicesMock.createWorkflow.mockResolvedValueOnce(sampleWorkflow);

    const res = await request(app)
      .post("/api/v1/workflows/workflows")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader())
      .send({ name: "My Workflow", description: "Automates data processing" });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(sampleWorkflow);
  });
});

describe("DELETE /api/v1/workflows/workflows/:workflowId", () => {
  it("returns 400 for a non-numeric workflow id", async () => {
    const res = await request(app)
      .delete("/api/v1/workflows/workflows/abc")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader());

    expect(res.status).toBe(400);
  });

  it("returns 200 when the workflow is deleted", async () => {
    workflowServicesMock.deleteWorkflow.mockResolvedValueOnce(sampleWorkflow);

    const res = await request(app)
      .delete("/api/v1/workflows/workflows/1")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader());

    expect(res.status).toBe(200);
  });

  it("returns 404 when the workflow does not exist", async () => {
    workflowServicesMock.deleteWorkflow.mockResolvedValueOnce(new Error("Workflow not found"));

    const res = await request(app)
      .delete("/api/v1/workflows/workflows/1")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader());

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/v1/workflows/workflows/:workflowId", () => {
  it("returns 400 when graphJson is invalid", async () => {
    const res = await request(app)
      .put("/api/v1/workflows/workflows/1")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader())
      .send({ graphJson: { nodes: "not-an-array", edges: [] } });

    expect(res.status).toBe(400);
  });

  it("returns 200 when the graph is saved", async () => {
    workflowServicesMock.updateWorkflowGraph.mockResolvedValueOnce(sampleWorkflow);

    const res = await request(app)
      .put("/api/v1/workflows/workflows/1")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader())
      .send({ graphJson: { nodes: [], edges: [] } });

    expect(res.status).toBe(200);
  });

  it("returns 403 when the user does not own the workflow", async () => {
    workflowServicesMock.updateWorkflowGraph.mockResolvedValueOnce(
      new Error("You do not have permission to update this workflow"),
    );

    const res = await request(app)
      .put("/api/v1/workflows/workflows/1")
      .set("Cookie", [authCookie(), csrfCookie()])
      .set(csrfHeader())
      .send({ graphJson: { nodes: [], edges: [] } });

    expect(res.status).toBe(403);
  });
});

describe("GET /api/v1/workflows/workflows/:workflowId/triggers", () => {
  it("returns 200 with the workflow triggers", async () => {
    workflowServicesMock.getWorkflowTriggers.mockResolvedValueOnce([]);

    const res = await request(app)
      .get("/api/v1/workflows/workflows/1/triggers")
      .set("Cookie", authCookie());

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});
