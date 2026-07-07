import {
  getExecutionsForWorkflow,
  getExecutionDetail,
  getLatestExecutionForWorkflow,
} from "./execution.services.ts";
import { httpResponse } from "../../utils/httpResponse.ts";
import { httpError } from "../../utils/httpError.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.ts";
import type { NextFunction, Request, Response } from "express";

export const getWorkflowExecutionsController = async (
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

    const executions = await getExecutionsForWorkflow(workflowId, userId);

    if (executions instanceof Error) {
      if (executions.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
        httpError(next, req, 404, executions.message);
        return;
      }
      if (executions.message === ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN) {
        httpError(next, req, 403, executions.message);
        return;
      }
      httpError(next, req, 400, executions.message);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.EXECUTIONS_RETRIEVED, executions);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getExecutionDetailController = async (
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
    const executionId = parseInt(req.params.executionId as string, 10);

    if (isNaN(workflowId) || isNaN(executionId)) {
      httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
      return;
    }

    const nodeExecutions = await getExecutionDetail(executionId, workflowId, userId);

    if (nodeExecutions instanceof Error) {
      if (nodeExecutions.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
        httpError(next, req, 404, nodeExecutions.message);
        return;
      }
      if (nodeExecutions.message === ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN) {
        httpError(next, req, 403, nodeExecutions.message);
        return;
      }
      httpError(next, req, 400, nodeExecutions.message);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.EXECUTION_RETRIEVED, nodeExecutions);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getLatestExecutionController = async (
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

    const result = await getLatestExecutionForWorkflow(workflowId, userId);

    if (result instanceof Error) {
      if (result.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
        httpError(next, req, 404, result.message);
        return;
      }
      if (result.message === ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN) {
        httpError(next, req, 403, result.message);
        return;
      }
      httpError(next, req, 400, result.message);
      return;
    }

    httpResponse(res, req, 200, SUCCESS_MESSAGES.LATEST_EXECUTION_RETRIEVED, result);
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
