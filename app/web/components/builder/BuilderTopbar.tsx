"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuilderTopbarProps {
  workflowName?: string;
  saving?: boolean;
  disabled?: boolean;
  onSave?: () => void;
}

export default function BuilderTopbar({
  workflowName,
  saving,
  disabled,
  onSave,
}: BuilderTopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/6 bg-[#0a0a0d] px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/6 hover:text-white/70"
        >
          <ArrowLeft size={16} />
        </Link>
        <span className="truncate text-[14px] font-medium text-[#f0eee9]">
          {workflowName || "Untitled workflow"}
        </span>
      </div>

      <Button size="sm" onClick={onSave} disabled={saving || disabled}>
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saving ? "Saving..." : "Save"}
      </Button>
    </header>
  );
}
