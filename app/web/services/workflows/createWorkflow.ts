import api from "@/lib/api";
import type { WorkflowItem } from "@/components/dashboard/types";

interface CreateWorkflowPayload {
  name: string;
  description: string;
}

export const createWorkflow = async (
  workflowData: CreateWorkflowPayload,
): Promise<WorkflowItem> => {
  try {
    const response = await api.post(`/v1/workflows/workflows`, workflowData);
    return response.data.data;
  } catch (err) {
    console.error("Error creating workflow:", err);
    throw err;
  }
};
