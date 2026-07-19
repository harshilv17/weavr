"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { config } from "@/config/config";
import { getLatestExecution } from "@/services/workflows/executions";

export type NodeRunStatus = "running" | "success" | "failed";

export interface RunLogEntry {
  nodeId: string;
  status: NodeRunStatus;
  output?: unknown;
  error?: string;
  startedAt?: string;
}

type ExecutionEvent = {
  type:
    "node:running" | "node:success" | "node:failed" | "execution:started" | "execution:finished";
  executionId: string;
  workflowId: string;
  nodeId?: string;
  data?: unknown;
  error?: string;
};

function backendOrigin() {
  return config.backend_URI.replace(/\/api\/?$/, "");
}

function upsertRunLog(prev: RunLogEntry[], entry: RunLogEntry): RunLogEntry[] {
  const index = prev.findIndex((e) => e.nodeId === entry.nodeId);
  if (index === -1) return [...prev, entry];
  const next = prev.slice();
  next[index] = { ...next[index], ...entry };
  return next;
}

export function useExecutionSocket(workflowId: number | string | undefined) {
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeRunStatus>>({});
  const [nodeResponses, setNodeResponses] = useState<Record<string, unknown>>({});
  const [runLog, setRunLog] = useState<RunLogEntry[]>([]);
  const [activeExecutions, setActiveExecutions] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);
  // Guards against a slow history fetch overwriting fresher state from a
  // live socket event that arrived while the fetch was in flight.
  const liveEventReceivedRef = useRef(false);

  useEffect(() => {
    if (!workflowId) return;

    liveEventReceivedRef.current = false;

    getLatestExecution(Number(workflowId))
      .then(({ execution, nodeExecutions }) => {
        if (liveEventReceivedRef.current || !execution) return;
        if (execution.status === "pending" || execution.status === "running") return;

        const statuses: Record<string, NodeRunStatus> = {};
        const responses: Record<string, unknown> = {};
        // nodeExecutions is newest-first (see getNodeExecutionsByExecutionId); reverse for run order.
        const log: RunLogEntry[] = [];
        for (const ne of [...nodeExecutions].reverse()) {
          if (ne.status === "completed") {
            statuses[ne.nodeId] = "success";
            if (ne.outputJson !== null) responses[ne.nodeId] = ne.outputJson;
            log.push({
              nodeId: ne.nodeId,
              status: "success",
              output: ne.outputJson ?? undefined,
              startedAt: ne.startedAt ?? undefined,
            });
          } else if (ne.status === "failed") {
            statuses[ne.nodeId] = "failed";
            if (ne.outputJson !== null) responses[ne.nodeId] = ne.outputJson;
            const errorValue = ne.outputJson as { error?: string } | null;
            log.push({
              nodeId: ne.nodeId,
              status: "failed",
              output: ne.outputJson ?? undefined,
              error: errorValue?.error,
              startedAt: ne.startedAt ?? undefined,
            });
          }
        }
        if (!liveEventReceivedRef.current) {
          setNodeStatuses(statuses);
          setNodeResponses(responses);
          setRunLog(log);
        }
      })
      .catch(() => {
        // best-effort history hydration; live socket events still work without it
      });

    const socket = io(backendOrigin(), {
      path: "/ws/executions",
      query: { workflowId: String(workflowId) },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("execution:event", (event: ExecutionEvent) => {
      liveEventReceivedRef.current = true;
      if (event.type === "execution:started") {
        setActiveExecutions((prev) => {
          const next = new Set(prev);
          next.add(event.executionId);
          return next;
        });
        setNodeStatuses({});
        setNodeResponses({});
        setRunLog([]);
        return;
      }

      if (event.type === "execution:finished") {
        setActiveExecutions((prev) => {
          const next = new Set(prev);
          next.delete(event.executionId);
          return next;
        });
        return;
      }

      if (!event.nodeId) return;

      if (event.type === "node:running") {
        setNodeStatuses((prev) => ({ ...prev, [event.nodeId!]: "running" }));
        setRunLog((prev) =>
          upsertRunLog(prev, {
            nodeId: event.nodeId!,
            status: "running",
            startedAt: new Date().toISOString(),
          }),
        );
      } else if (event.type === "node:success") {
        setNodeStatuses((prev) => ({ ...prev, [event.nodeId!]: "success" }));
        if (event.data !== undefined) {
          setNodeResponses((prev) => ({ ...prev, [event.nodeId!]: event.data }));
        }
        setRunLog((prev) =>
          upsertRunLog(prev, { nodeId: event.nodeId!, status: "success", output: event.data }),
        );
      } else if (event.type === "node:failed") {
        setNodeStatuses((prev) => ({ ...prev, [event.nodeId!]: "failed" }));
        if (event.error) {
          setNodeResponses((prev) => ({ ...prev, [event.nodeId!]: { error: event.error } }));
        }
        setRunLog((prev) =>
          upsertRunLog(prev, { nodeId: event.nodeId!, status: "failed", error: event.error }),
        );
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [workflowId]);

  return { nodeStatuses, nodeResponses, runLog, isExecuting: activeExecutions.size > 0 };
}
