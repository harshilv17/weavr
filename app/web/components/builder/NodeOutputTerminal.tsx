"use client";

import { useState } from "react";
import { CheckCircle2, ChevronsDownUp, ChevronsUpDown, Loader2, XCircle } from "lucide-react";
import type { Node } from "reactflow";
import type { RunLogEntry } from "@/hooks/useExecutionSocket";

interface NodeOutputTerminalProps {
  node: Node | null;
  response?: unknown;
  runLog?: RunLogEntry[];
  allNodes?: Node[];
}

function formatResponse(value: unknown) {
  if (value == null) return "No response yet.";
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "Unable to render response.";
  }
}

const STATUS_ICON = {
  running: <Loader2 size={12} className="animate-spin text-white/50" />,
  success: <CheckCircle2 size={12} className="text-emerald-400" />,
  failed: <XCircle size={12} className="text-red-400" />,
};

function RunLogPanel({
  runLog,
  allNodes,
  expanded,
}: {
  runLog: RunLogEntry[];
  allNodes: Node[];
  expanded: boolean;
}) {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const labelFor = (nodeId: string) =>
    (allNodes.find((n) => n.id === nodeId)?.data?.label as string | undefined) ?? nodeId;

  if (runLog.length === 0) {
    return (
      <p className="px-1 py-2 text-[11px] text-white/35">
        No run yet. Trigger the workflow to see a log here.
      </p>
    );
  }

  return (
    <div className={`flex flex-col gap-1 overflow-auto ${expanded ? "max-h-[65vh]" : "max-h-44"}`}>
      {runLog.map((entry) => {
        const isExpanded = expandedNodeId === entry.nodeId;
        const isFailed = entry.status === "failed";
        return (
          <div key={entry.nodeId} className="rounded-lg border border-white/6 bg-white/2">
            <button
              type="button"
              onClick={() => setExpandedNodeId(isExpanded ? null : entry.nodeId)}
              className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left"
            >
              {STATUS_ICON[entry.status]}
              <span className="min-w-0 flex-1 truncate text-[12px] text-white/75">
                {labelFor(entry.nodeId)}
              </span>
              {isFailed && entry.error && (
                <span className="truncate text-[11px] text-red-400/80">{entry.error}</span>
              )}
              <code className="shrink-0 text-[10px] text-white/25">{entry.nodeId}</code>
            </button>
            {isExpanded && (
              <pre
                className={`overflow-auto whitespace-pre-wrap wrap-break-word border-t border-white/6 px-2.5 py-2 font-mono text-[11px] leading-5 text-white/60 ${expanded ? "max-h-[50vh]" : "max-h-32"}`}
              >
                {formatResponse(isFailed ? (entry.error ?? entry.output) : entry.output)}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NodeOutputTerminal({
  node,
  response,
  runLog = [],
  allNodes = [],
}: NodeOutputTerminalProps) {
  const [tab, setTab] = useState<"node" | "log">("node");
  const [expanded, setExpanded] = useState(false);
  const label = node?.data?.label as string | undefined;
  const nodeId = node?.id;
  const failedCount = runLog.filter((e) => e.status === "failed").length;

  return (
    <section className="shrink-0 border-t border-white/6 bg-[#09090c] px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-white/6 bg-white/2 p-0.5">
          <button
            type="button"
            onClick={() => setTab("node")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${tab === "node" ? "bg-white/8 text-white/80" : "text-white/35 hover:text-white/60"}`}
          >
            Selected Node
          </button>
          <button
            type="button"
            onClick={() => setTab("log")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${tab === "log" ? "bg-white/8 text-white/80" : "text-white/35 hover:text-white/60"}`}
          >
            Run Log
            {failedCount > 0 && (
              <span className="rounded-full bg-red-500/20 px-1.5 text-[10px] text-red-400">
                {failedCount}
              </span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 rounded-md border border-white/6 bg-white/2 px-2.5 py-1 text-[11px] font-medium text-white/45 transition-colors hover:bg-white/6 hover:text-white/75"
        >
          {expanded ? <ChevronsDownUp size={12} /> : <ChevronsUpDown size={12} />}
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {tab === "node" ? (
        <>
          <p className="mb-2 truncate text-[12px] text-white/45">
            {nodeId
              ? `Output for ${label || "selected node"} (${nodeId})`
              : "Select a node to inspect its output"}
          </p>
          <div className="rounded-xl border border-white/8 bg-[#0d0d11] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <pre
              className={`overflow-auto whitespace-pre-wrap wrap-break-word font-mono text-[11px] leading-5 text-white/75 ${expanded ? "max-h-[65vh]" : "max-h-44"}`}
            >
              {nodeId ? formatResponse(response) : "No node selected."}
            </pre>
          </div>
        </>
      ) : (
        <RunLogPanel runLog={runLog} allNodes={allNodes} expanded={expanded} />
      )}
    </section>
  );
}
