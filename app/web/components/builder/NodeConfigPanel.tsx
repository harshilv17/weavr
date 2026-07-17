"use client";

import { useState } from "react";
import { Copy, Loader2, Play, Square, X } from "lucide-react";
import type { Node } from "reactflow";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { runWorkflow } from "@/services/workflows/runWorkflow";
import { startWorkflowSchedule, stopWorkflowSchedule } from "@/services/workflows/schedule";
import { config } from "@/config/config";
import ConfigFieldInput from "./ConfigField";
import {
  AI_PROVIDERS,
  NODE_CONFIG_FIELDS,
  MIN_SCHEDULE_INTERVAL_SECONDS,
  getAIProviderFields,
  getTriggerFields,
  type AIProviderValue,
} from "./nodeConfigSchemas";
import { getNodeDef, type BuilderNodeCategory } from "./nodeTypes";

interface NodeConfigPanelProps {
  node: Node;
  workflowId: number;
  onChange: (nodeId: string, data: Record<string, unknown>) => void;
  onClose: () => void;
  disabled?: boolean;
  scheduleEnabled?: boolean;
  scheduleIntervalSeconds?: number | null;
  onScheduleChange?: () => void;
  webhookToken?: string;
}

const PROVIDER_FIELD = {
  key: "provider",
  label: "Provider",
  type: "select" as const,
  required: true,
  options: AI_PROVIDERS.map((p) => ({ value: p.value, label: p.label })),
};

export default function NodeConfigPanel({
  node,
  workflowId,
  onChange,
  onClose,
  disabled,
  scheduleEnabled = false,
  scheduleIntervalSeconds = null,
  onScheduleChange,
  webhookToken,
}: NodeConfigPanelProps) {
  const category = node.data?.category as BuilderNodeCategory | undefined;
  const def = getNodeDef(category);
  const label = def?.label ?? node.data?.label ?? "Node";
  const Icon = def?.icon;
  const color = def?.color ?? "#8b8b93";
  const triggerType = (node.data?.type as string | undefined) ?? "manual";
  const isManualTrigger = category === "trigger" && triggerType === "manual";
  const isCronTrigger = category === "trigger" && triggerType === "cron";
  const isWebhookTrigger = category === "trigger" && triggerType === "webhook";
  const [running, setRunning] = useState(false);
  const [scheduleUpdating, setScheduleUpdating] = useState(false);

  function setField(key: string, value: string | Record<string, string>) {
    onChange(node.id, { ...node.data, [key]: value });
  }

  async function handleRun() {
    setRunning(true);
    try {
      const res = await runWorkflow(workflowId);
      toast.success("Workflow run completed");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to run workflow")
        : "Failed to run workflow";
      toast.error(message);
    } finally {
      setRunning(false);
    }
  }

  async function handleStartSchedule() {
    const intervalSeconds = Number(node.data?.intervalSeconds);

    if (!Number.isInteger(intervalSeconds) || intervalSeconds < MIN_SCHEDULE_INTERVAL_SECONDS) {
      toast.error(
        `Interval must be a whole number of seconds, minimum ${MIN_SCHEDULE_INTERVAL_SECONDS}`,
      );
      return;
    }

    setScheduleUpdating(true);
    try {
      await startWorkflowSchedule(workflowId, intervalSeconds);
      toast.success("Schedule started");
      onScheduleChange?.();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to start schedule")
        : "Failed to start schedule";
      toast.error(message);
    } finally {
      setScheduleUpdating(false);
    }
  }

  async function handleStopSchedule() {
    setScheduleUpdating(true);
    try {
      await stopWorkflowSchedule(workflowId);
      toast.success("Schedule stopped");
      onScheduleChange?.();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to stop schedule")
        : "Failed to stop schedule";
      toast.error(message);
    } finally {
      setScheduleUpdating(false);
    }
  }

  const fields =
    category === "ai"
      ? [PROVIDER_FIELD, ...getAIProviderFields(node.data?.provider as AIProviderValue | undefined)]
      : category === "trigger"
        ? getTriggerFields(triggerType)
        : category
          ? NODE_CONFIG_FIELDS[category]
          : [];

  return (
    <div
      className={`flex w-64 shrink-0 flex-col gap-3 overflow-y-auto border-l border-white/6 bg-[#0a0a0d] p-3 ${disabled ? "pointer-events-none opacity-70" : ""}`}
      aria-disabled={disabled}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex min-w-0 items-center gap-2">
          {Icon && (
            <div
              className="flex size-6 shrink-0 items-center justify-center rounded-md"
              style={{ background: `${color}1f`, color }}
            >
              <Icon size={13} />
            </div>
          )}
          <span className="truncate text-[11px] font-medium uppercase tracking-[0.06em] text-white/25">
            Configure — {label}
          </span>
        </div>
        <button
          onClick={onClose}
          disabled={disabled}
          className="flex shrink-0 items-center justify-center rounded p-1 text-white/30 transition-colors hover:bg-white/6 hover:text-white/70"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-[0.06em] text-white/20">Node ID</span>
        <code className="truncate rounded bg-white/4 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
          {node.id}
        </code>
      </div>

      {fields.length === 0 ? (
        <p className="px-1 text-[12px] text-white/30">No configuration needed for this node.</p>
      ) : (
        fields.map((field) => (
          <ConfigFieldInput
            key={field.key}
            field={field}
            value={node.data?.[field.key] ?? (field.type === "keyvalue" ? {} : "")}
            onChange={(value) => setField(field.key, value)}
            disabled={disabled}
          />
        ))
      )}

      {isManualTrigger && (
        <Button size="sm" className="w-full" onClick={handleRun} disabled={running || disabled}>
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {running ? "Running..." : "Run"}
        </Button>
      )}

      {isCronTrigger && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase tracking-[0.06em] text-white/20">Status</span>
            <span
              className={`text-[11px] font-medium ${scheduleEnabled ? "text-emerald-400" : "text-white/40"}`}
            >
              {scheduleEnabled ? `Running · every ${scheduleIntervalSeconds}s` : "Stopped"}
            </span>
          </div>
          {scheduleEnabled ? (
            <Button
              size="sm"
              variant="destructive"
              className="w-full"
              onClick={handleStopSchedule}
              disabled={scheduleUpdating || disabled}
            >
              {scheduleUpdating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Square size={14} />
              )}
              {scheduleUpdating ? "Stopping..." : "Stop"}
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full"
              onClick={handleStartSchedule}
              disabled={scheduleUpdating || disabled}
            >
              {scheduleUpdating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Play size={14} />
              )}
              {scheduleUpdating ? "Starting..." : "Start"}
            </Button>
          )}
        </div>
      )}

      {isWebhookTrigger && (
        <div className="flex flex-col gap-1.5">
          <span className="px-1 text-[10px] uppercase tracking-[0.06em] text-white/20">
            Webhook URL
          </span>
          {webhookToken ? (
            <div className="flex items-center gap-1.5">
              <code className="min-w-0 flex-1 truncate rounded-lg border border-white/8 bg-white/2 px-2.5 py-1.5 font-mono text-[11px] text-white/70">
                {`${config.backend_URI}/v1/webhooks/${webhookToken}`}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${config.backend_URI}/v1/webhooks/${webhookToken}`,
                  );
                  toast.success("Webhook URL copied");
                }}
                className="flex shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/2 p-1.5 text-white/40 transition-colors hover:bg-white/6 hover:text-white/75"
              >
                <Copy size={13} />
              </button>
            </div>
          ) : (
            <p className="px-1 text-[11px] text-white/35">
              Save the workflow to generate a webhook URL.
            </p>
          )}
          <p className="px-1 text-[11px] text-white/35">
            POST to this URL with any JSON body to run this workflow. The body is available to other
            nodes as <code className="text-white/50">{"{{trigger.body...}}"}</code>.
          </p>
        </div>
      )}
    </div>
  );
}
