import api from "@/lib/api";

export const runWorkflow = async (workflowId: number) => {
  try {
    const response = await api.post(`/v1/workflows/workflows/${workflowId}/run`);
    return response.data.data;
  } catch (err) {
    console.error("Error running workflow:", err);
    throw err;
  }
};
