"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import type { WorkflowItem } from "@/components/dashboard/types";

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await api.get(`/v1/workflows/workflows`);
        setWorkflows(response.data.data);
      } catch {
        setError("Failed to load workflows");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflows();
  }, []);

  function addWorkflow(workflow: WorkflowItem) {
    setWorkflows((prev) => [workflow, ...prev]);
  }

  function removeWorkflow(workflowId: number) {
    setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
  }

  return { workflows, loading, error, addWorkflow, removeWorkflow };
}
