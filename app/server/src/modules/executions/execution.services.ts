import { getWorkflowById } from "../workflows/workflow.repo.ts";
import { workflows } from "../../db/schemas/workflow.schema.ts";
import { ERROR_MESSAGES } from "../../constants/messages.ts";
import {
  getExecutionsByWorkflowId,
  getNodeExecutionsByExecutionId,
  getLatestExecutionByWorkflowId,
} from "./execution.repo.ts";

export const getExecutionsForWorkflow = async (workflowId: number, userId: number) => {
  const workflow = (await getWorkflowById(workflowId)) as typeof workflows.$inferSelect | undefined;

  if (!workflow) {
    return new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);
  }

  if (workflow.userId !== userId) {
    return new Error(ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
  }

  const executions = await getExecutionsByWorkflowId(workflowId);

  if (executions instanceof Error) {
    return executions;
  }

  return executions;
};

export const getExecutionDetail = async (
  executionId: number,
  workflowId: number,
  userId: number,
) => {
  const workflow = (await getWorkflowById(workflowId)) as typeof workflows.$inferSelect | undefined;

  if (!workflow) {
    return new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);
  }

  if (workflow.userId !== userId) {
    return new Error(ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
  }

  const nodeExecutions = await getNodeExecutionsByExecutionId(executionId);

  if (nodeExecutions instanceof Error) {
    return nodeExecutions;
  }

  return nodeExecutions;
};

export const getLatestExecutionForWorkflow = async (workflowId: number, userId: number) => {
  const workflow = (await getWorkflowById(workflowId)) as typeof workflows.$inferSelect | undefined;

  if (!workflow) {
    return new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);
  }

  if (workflow.userId !== userId) {
    return new Error(ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
  }

  const latestExecution = await getLatestExecutionByWorkflowId(workflowId);

  if (latestExecution instanceof Error) {
    return latestExecution;
  }

  if (!latestExecution) {
    return { execution: null, nodeExecutions: [] };
  }

  const nodeExecutions = await getNodeExecutionsByExecutionId(latestExecution.id);

  if (nodeExecutions instanceof Error) {
    return nodeExecutions;
  }

  return { execution: latestExecution, nodeExecutions };
};
