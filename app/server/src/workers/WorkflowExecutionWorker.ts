import { Worker, type Job } from "bullmq";
import { workflowQueueConnection } from "../config/queue/WorkflowExecution.queue.ts";
import { executeWorkflow } from "../modules/executions/executor.services.ts";
import type { WorkflowExecutionJobData } from "../jobs/workflowExecution.job.ts";
import logger from "../utils/logger.ts";

const WORKFLOW_WORKER_CONCURRENCY = 10;

export const workflowExecutionWorker = new Worker<WorkflowExecutionJobData>(
  "run-workflow",
  async (job: Job<WorkflowExecutionJobData>) => {
    const { workflowId, userId, triggerOverrideData } = job.data;
    const executionId = `exec_${Date.now()}_${workflowId}_${job.id}`;

    const result = await executeWorkflow(workflowId, userId, executionId, triggerOverrideData);

    if (result instanceof Error) {
      throw result;
    }

    return result;
  },
  { connection: workflowQueueConnection, concurrency: WORKFLOW_WORKER_CONCURRENCY },
);

workflowExecutionWorker.on("completed", (job) => {
  logger.info(`Workflow execution completed for job ${job.id} (workflow ${job.data.workflowId})`);
});

workflowExecutionWorker.on("failed", (job, err) => {
  logger.error(`Workflow execution job ${job?.id} failed`, err);
});
