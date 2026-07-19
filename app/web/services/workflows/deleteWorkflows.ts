import api from "@/lib/api";
export const deleteWorkflow = async (workflowId: number) => {
  try {
    const res = await api.delete(`/v1/workflows/workflows/${workflowId}`);
    return res;
  } catch (err) {
    console.error("Error creating workflow:", err);
    throw err;
  }
};
