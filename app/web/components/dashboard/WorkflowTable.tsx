"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { Workflow, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import StatusPill from "./StatusPill";
import type { WorkflowItem } from "./types";
import { deleteWorkflow } from "@/services/workflows/deleteWorkflows";

const COLUMNS = ["Name", "Status", "Updated", ""];

interface WorkflowTableProps {
  workflows: WorkflowItem[];
  loading?: boolean;
  onDeleted?: (workflowId: number) => void;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function WorkflowRow({
  wf,
  index,
  onDeleted,
}: {
  wf: WorkflowItem;
  index: number;
  onDeleted?: (workflowId: number) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteWorkflow(wf.id);
      toast.success(`"${wf.name}" deleted`);
      onDeleted?.(wf.id);
    } catch {
      toast.error("Failed to delete workflow. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div
      onClick={() => router.push(`/builder/${wf.id}`)}
      className="grid grid-cols-[1fr_180px_100px_40px] gap-4 items-center border-b border-white/[0.04] px-5 py-4 last:border-0 transition-colors hover:bg-white/[0.03] cursor-pointer"
      style={{ animationDelay: `${140 + index * 30}ms`, opacity: deleting ? 0.5 : 1 }}
    >
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium text-[#f0eee9]">{wf.name}</p>
        <p className="truncate text-[12px] text-white/35">{wf.description}</p>
      </div>

      <StatusPill status={wf.status} scheduleEnabled={wf.scheduleEnabled} />

      <span className="text-[12px] text-white/35">{timeAgo(wf.updatedAt)}</span>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            disabled={deleting}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
            className="flex items-center justify-center rounded p-1 text-white/25 transition-colors hover:bg-white/10 hover:text-white/60 disabled:pointer-events-none"
          >
            {deleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <MoreHorizontal size={14} />
            )}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            className="z-50 min-w-[140px] rounded-lg border border-white/[0.08] bg-[#0a0a0d] p-1 shadow-2xl outline-none"
          >
            <DropdownMenu.Item
              onSelect={handleDelete}
              className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 text-[13px] text-red-400 outline-none transition-colors hover:bg-red-500/10 data-highlighted:bg-red-500/10"
            >
              <Trash2 size={13} />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

function WorkflowRowSkeleton({ index }: { index: number }) {
  return (
    <div
      className="grid grid-cols-[1fr_180px_100px_40px] gap-4 items-center border-b border-white/[0.04] px-5 py-4 last:border-0"
      style={{ animationDelay: `${140 + index * 30}ms` }}
    >
      <div className="min-w-0 space-y-2">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
      </div>
      <div className="h-5 w-16 animate-pulse rounded-full bg-white/[0.06]" />
      <div className="h-3 w-14 animate-pulse rounded bg-white/[0.04]" />
      <div className="h-4 w-4 animate-pulse rounded bg-white/[0.04]" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-white/30">
      <Workflow size={28} className="opacity-30" />
      <p className="text-[13px]">No workflows found</p>
    </div>
  );
}

export default function WorkflowTable({ workflows, loading, onDeleted }: WorkflowTableProps) {
  return (
    <div
      className="dash-enter mb-6 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
      style={{ animationDelay: "140ms" }}
    >
      <div className="grid grid-cols-[1fr_180px_100px_40px] gap-4 border-b border-white/[0.05] px-5 py-3">
        {COLUMNS.map((h) => (
          <span
            key={h}
            className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/25"
          >
            {h}
          </span>
        ))}
      </div>

      {loading ? (
        Array.from({ length: 5 }, (_, i) => <WorkflowRowSkeleton key={i} index={i} />)
      ) : workflows.length === 0 ? (
        <EmptyState />
      ) : (
        workflows.map((wf, i) => (
          <WorkflowRow key={wf.id} wf={wf} index={i} onDeleted={onDeleted} />
        ))
      )}
    </div>
  );
}
