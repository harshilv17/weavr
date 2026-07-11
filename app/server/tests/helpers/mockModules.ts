import { jest } from "@jest/globals";

export const authServicesMock = {
  createUser: jest.fn(),
  signOutUser: jest.fn(),
  signInUser: jest.fn(),
  verifyEmail: jest.fn(),
  refreshAccessToken: jest.fn(),
  emailVerified: jest.fn(),
};

export const workflowServicesMock = {
  createWorkflow: jest.fn(),
  getUserWorkflows: jest.fn(),
  getWorkflow: jest.fn(),
  deleteWorkflow: jest.fn(),
  updateWorkflowGraph: jest.fn(),
  getWorkflowTriggers: jest.fn(),
};

export const executionServicesMock = {
  getExecutionsForWorkflow: jest.fn(),
  getExecutionDetail: jest.fn(),
  getLatestExecutionForWorkflow: jest.fn(),
};

export const executorServicesMock = {
  buildExecutionGraph: jest.fn(),
  executeWorkflow: jest.fn(),
  startWorkflowScheduleService: jest.fn(),
  stopWorkflowScheduleService: jest.fn(),
  resolveWebhookTrigger: jest.fn(),
  MIN_SCHEDULE_INTERVAL_SECONDS: 60,
};

export const workflowExecutionJobMock = {
  addWorkflowExecutionJob: jest.fn(),
  schedulerIdForWorkflow: jest.fn((workflowId: number) => `workflow-${workflowId}`),
  startWorkflowSchedule: jest.fn(),
  stopWorkflowSchedule: jest.fn(),
};

export function registerServiceMocks() {
  jest.unstable_mockModule("../../src/modules/auth/auth.services.ts", () => authServicesMock);
  jest.unstable_mockModule(
    "../../src/modules/workflows/workflow.services.ts",
    () => workflowServicesMock,
  );
  jest.unstable_mockModule(
    "../../src/modules/executions/execution.services.ts",
    () => executionServicesMock,
  );
  jest.unstable_mockModule(
    "../../src/modules/executions/executor.services.ts",
    () => executorServicesMock,
  );
  jest.unstable_mockModule(
    "../../src/jobs/workflowExecution.job.ts",
    () => workflowExecutionJobMock,
  );
}
