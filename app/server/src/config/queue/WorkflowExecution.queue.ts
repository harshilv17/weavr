import { Queue } from "bullmq";
import { config } from "../config.ts";
//url: config.redisUrl
export const workflowQueueConnection = { url: config.redisUrl };

export const WorkflowExecutionQueue = new Queue("run-workflow", {
  connection: workflowQueueConnection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: 200,
    removeOnFail: 200,
  },
});
