import { CheckCircle2, Clock, FileEdit, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStatus } from "./types";

const STATUS_CFG: Record<WorkflowStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  draft: {
    label: "Draft",
    cls: "bg-white/5 text-white/40 border-white/10",
    icon: <FileEdit size={11} />,
  },
  active: {
    label: "Active",
    cls: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: <CheckCircle2 size={11} />,
  },
  completed: {
    label: "Completed",
    cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: <Clock size={11} />,
  },
};

export default function StatusPill({
  status,
  scheduleEnabled,
}: {
  status: WorkflowStatus;
  scheduleEnabled?: boolean;
}) {
  const { label, cls, icon } = STATUS_CFG[status];
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
          cls,
        )}
      >
        {icon}
        {label}
      </span>
      {scheduleEnabled && (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
          <Radio size={11} className="animate-pulse" />
          Running
        </span>
      )}
    </span>
  );
}
