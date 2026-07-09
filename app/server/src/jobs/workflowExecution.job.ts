import { WorkflowExecutionQueue } from "../config/queue/WorkflowExecution.queue.ts";

export type WorkflowExecutionJobData = {
  workflowId: number;
  userId: number;
  triggerOverrideData?: Record<string, any>;
};

export async function addWorkflowExecutionJob(data: WorkflowExecutionJobData) {
  return WorkflowExecutionQueue.add("run-workflow", data);
}

export function schedulerIdForWorkflow(workflowId: number) {
  return `workflow-${workflowId}`;
}

export async function startWorkflowSchedule(
  data: WorkflowExecutionJobData,
  intervalSeconds: number,
) {
  return WorkflowExecutionQueue.upsertJobScheduler(
    schedulerIdForWorkflow(data.workflowId),
    { every: intervalSeconds * 1000 },
    { name: "run-workflow", data },
  );
}

export async function stopWorkflowSchedule(workflowId: number) {
  return WorkflowExecutionQueue.removeJobScheduler(schedulerIdForWorkflow(workflowId));
}
