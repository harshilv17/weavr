import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api from "@/lib/api";
import type { WorkflowItem } from "@/components/dashboard/types";
export function useWorkflow(workflowId: number | string) {
  const [workflow, setWorkflow] = useState<WorkflowItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchWorkflow = useCallback(async () => {
    try {
      const response = await api.get(`/v1/workflows/workflows/${workflowId}`);
      setWorkflow(response.data.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError("Failed to load workflow");
      }
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    // fetchWorkflow is an async data fetch (state is set after the awaited
    // request resolves, not synchronously) — the standard fetch-on-mount
    // pattern the rule's own docs endorse, not the sync cascading-render case.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkflow();
  }, [fetchWorkflow]);

  // Refreshes only the schedule fields in place, without replacing the
  // `workflow` object's graphJson reference — a full refetch would reset
  // the canvas to the last-saved graph and discard unsaved edits.
  const refetchScheduleOnly = useCallback(async () => {
    try {
      const response = await api.get(`/v1/workflows/workflows/${workflowId}`);
      const updated = response.data.data as WorkflowItem;
      setWorkflow((prev) =>
        prev
          ? {
              ...prev,
              scheduleEnabled: updated.scheduleEnabled,
              scheduleIntervalSeconds: updated.scheduleIntervalSeconds,
            }
          : updated,
      );
    } catch {
      // best-effort refresh; ignore failures here
    }
  }, [workflowId]);

  return { workflow, loading, error, notFound, refetch: fetchWorkflow, refetchScheduleOnly };
}
