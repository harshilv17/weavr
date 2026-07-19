import api from "@/lib/api";

export const startWorkflowSchedule = async (workflowId: number, intervalSeconds: number) => {
  try {
    const response = await api.post(`/v1/workflows/workflows/${workflowId}/schedule/start`, {
      intervalSeconds,
    });
    return response.data.data;
  } catch (err) {
    console.error("Error starting workflow schedule:", err);
    throw err;
  }
};

export const stopWorkflowSchedule = async (workflowId: number) => {
  try {
    const response = await api.post(`/v1/workflows/workflows/${workflowId}/schedule/stop`);
    return response.data.data;
  } catch (err) {
    console.error("Error stopping workflow schedule:", err);
    throw err;
  }
};
