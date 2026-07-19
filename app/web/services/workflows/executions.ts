import api from "@/lib/api";

export interface NodeExecutionItem {
  id: number;
  executionId: number;
  nodeId: string;
  nodeType: string;
  status: "pending" | "running" | "completed" | "failed";
  inputJson: unknown;
  outputJson: unknown;
  startedAt: string | null;
  completedAt: string | null;
}

export interface ExecutionItem {
  id: number;
  workflowId: number;
  triggerId: number;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string | null;
  completedAt: string | null;
}

export interface LatestExecutionResponse {
  execution: ExecutionItem | null;
  nodeExecutions: NodeExecutionItem[];
}

export const getLatestExecution = async (workflowId: number): Promise<LatestExecutionResponse> => {
  const response = await api.get(`/v1/workflows/workflows/${workflowId}/executions/latest`);
  return response.data.data;
};
