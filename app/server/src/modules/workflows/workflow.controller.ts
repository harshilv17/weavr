import {
  createWorkflow,
  deleteWorkflow,
  getUserWorkflows,
  getWorkflow,
  updateWorkflowGraph,
  getWorkflowTriggers,
} from "./workflow.services.ts";
import {
  buildExecutionGraph,
  startWorkflowScheduleService,
  stopWorkflowScheduleService,
} from "../executions/executor.services.ts";
import { addWorkflowExecutionJob } from "../../jobs/workflowExecution.job.ts";
import { httpResponse } from "../../utils/httpResponse.ts";
import { httpError } from "../../utils/httpError.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.ts";
import type { NextFunction, Request, Response } from "express";

export const getUserWorkflowsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }
    const workflows = await getUserWorkflows(userId);

    httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOWS_RETRIEVED, workflows);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getWorkflowController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflowId = parseInt(req.params.workflowId as string, 10);

    if (isNaN(workflowId)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
      return;
    }
    const workflow = await getWorkflow(workflowId);

    if (workflow instanceof Error) {
      httpError(next, req, 404, workflow.message);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOW_RETRIEVED, workflow);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const createWorkflowController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    const { name, description } = req.body;

    if (!name || !description) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_MISSING_FIELDS);
      return;
    }

    const workflow = await createWorkflow(userId, name, description);

    if (workflow instanceof Error) {
      httpError(next, req, 400, workflow.message);
      return;
    }

    httpResponse(res, req, 201, SUCCESS_MESSAGES.WORKFLOW_CREATED, workflow);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const deleteWorkflowController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    const workflowId = parseInt(req.params.workflowId as string, 10);

    if (isNaN(workflowId)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
      return;
    }

    const workflow = await deleteWorkflow(workflowId, userId);

    if (workflow instanceof Error) {
      if (workflow.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
        httpError(next, req, 404, workflow.message);
        return;
      }
      httpError(next, req, 400, workflow.message);
      return;
      httpError(next, req, 403, ERROR_MESSAGES.WORKFLOW_FORBIDDEN);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOW_DELETED, workflow);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const updateWorkflowGraphController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    const workflowId = parseInt(req.params.workflowId as string, 10);

    if (isNaN(workflowId)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
      return;
    }

    const { graphJson } = req.body;

    if (!graphJson || !Array.isArray(graphJson.nodes) || !Array.isArray(graphJson.edges)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_GRAPH_INVALID);
      return;
    }

    const workflow = await updateWorkflowGraph(workflowId, userId, graphJson);

    if (workflow instanceof Error) {
      if (workflow.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
        httpError(next, req, 404, workflow.message);
        return;
      }
      if (workflow.message === "Too many nodes") {
        httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_TOO_MANY_NODES);
        return;
      }
      if (workflow.message === "Invalid graph") {
        httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_GRAPH_INVALID);
        return;
      }
      if (workflow.message === ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN) {
        httpError(next, req, 403, ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
        return;
      }
      httpError(next, req, 400, workflow.message);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOW_SAVED, workflow);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const runWorkflowController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    const workflowId = parseInt(req.params.workflowId as string, 10);

    if (isNaN(workflowId)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
      return;
    }

    const graph = await buildExecutionGraph(workflowId, userId);

    if (graph instanceof Error) {
      if (graph.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
        httpError(next, req, 404, graph.message);
        return;
      }
      if (graph.message === ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN) {
        httpError(next, req, 403, graph.message);
        return;
      }
      httpError(next, req, 400, graph.message);
      return;
    }

    await addWorkflowExecutionJob({ workflowId, userId });

    httpResponse(res, req, 202, SUCCESS_MESSAGES.WORKFLOW_RUN_STARTED, { status: "queued" });
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

function handleScheduleServiceError(next: NextFunction, req: Request, error: Error) {
  if (error.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
    httpError(next, req, 404, error.message);
    return;
  }
  if (error.message === ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN) {
    httpError(next, req, 403, error.message);
    return;
  }
  if (error.message === ERROR_MESSAGES.SCHEDULE_INTERVAL_TOO_SHORT) {
    httpError(next, req, 400, error.message);
    return;
  }
  httpError(next, req, 400, error.message);
}

export const startWorkflowScheduleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    const workflowId = parseInt(req.params.workflowId as string, 10);

    if (isNaN(workflowId)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
      return;
    }

    const intervalSeconds = Number(req.body?.intervalSeconds);

    const result = await startWorkflowScheduleService(workflowId, userId, intervalSeconds);

    if (result instanceof Error) {
      handleScheduleServiceError(next, req, result);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.SCHEDULE_STARTED, result);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const stopWorkflowScheduleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    const workflowId = parseInt(req.params.workflowId as string, 10);

    if (isNaN(workflowId)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
      return;
    }

    const result = await stopWorkflowScheduleService(workflowId, userId);

    if (result instanceof Error) {
      handleScheduleServiceError(next, req, result);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.SCHEDULE_STOPPED, result);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getWorkflowTriggersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    const workflowId = parseInt(req.params.workflowId as string, 10);

    if (isNaN(workflowId)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
      return;
    }

    const triggers = await getWorkflowTriggers(workflowId, userId);

    if (triggers instanceof Error) {
      if (triggers.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
        httpError(next, req, 404, triggers.message);
        return;
      }
      if (triggers.message === ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN) {
        httpError(next, req, 403, triggers.message);
        return;
      }
      httpError(next, req, 400, triggers.message);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOW_TRIGGERS_RETRIEVED, triggers);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
