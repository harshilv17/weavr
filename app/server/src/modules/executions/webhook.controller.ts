import { resolveWebhookTrigger } from "./executor.services.ts";
import { addWorkflowExecutionJob } from "../../jobs/workflowExecution.job.ts";
import { httpResponse } from "../../utils/httpResponse.ts";
import { httpError } from "../../utils/httpError.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.ts";
import type { NextFunction, Request, Response } from "express";

export const triggerWebhookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token as string;

    const resolved = await resolveWebhookTrigger(token);

    if (resolved instanceof Error) {
      httpError(next, req, 404, resolved.message);
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;

    await addWorkflowExecutionJob({
      workflowId: resolved.workflowId,
      userId: resolved.userId,
      triggerOverrideData: { body, query: req.query, headers: req.headers },
    });

    httpResponse(res, req, 202, SUCCESS_MESSAGES.WEBHOOK_TRIGGERED, { status: "queued" });
  } catch (error) {
    httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
