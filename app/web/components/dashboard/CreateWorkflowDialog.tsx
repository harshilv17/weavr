"use client";

import { useState, type FormEvent } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createWorkflow } from "@/services/workflows/createWorkflow";
import type { WorkflowItem } from "./types";

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (workflow: WorkflowItem) => void;
}

const inputCls = cn(
  "w-full rounded px-4 py-2.5 text-[13px] text-[#f0eee9]",
  "placeholder:text-white/25 outline-none",
  "bg-white/5 border border-white/[0.06]",
  "transition-[border-color,box-shadow]",
  "focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/20",
);

export default function CreateWorkflowDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateWorkflowDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setDescription("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim() || submitting) return;

    setSubmitting(true);
    try {
      const workflow = await createWorkflow({ name: name.trim(), description: description.trim() });
      onCreated(workflow);
      toast.success("Workflow created");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create workflow. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next: boolean) => {
        if (!submitting) {
          onOpenChange(next);
          if (!next) reset();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/[0.08] bg-[#0a0a0d] p-6 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          onEscapeKeyDown={(e: Event) => submitting && e.preventDefault()}
          onPointerDownOutside={(e: Event) => submitting && e.preventDefault()}
        >
          <div className="mb-5 flex items-center justify-between">
            <DialogPrimitive.Title className="font-display text-[17px] font-bold tracking-[-0.02em] text-[#f0eee9]">
              Create Workflow
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              disabled={submitting}
              className="flex items-center justify-center rounded p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60 disabled:opacity-40"
            >
              <X size={16} />
            </DialogPrimitive.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="wf-name" className="text-[12px] font-medium text-white/50">
                Name
              </label>
              <input
                id="wf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Workflow"
                autoFocus
                disabled={submitting}
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="wf-description" className="text-[12px] font-medium text-white/50">
                Description
              </label>
              <textarea
                id="wf-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Automates data processing"
                rows={3}
                disabled={submitting}
                className={cn(inputCls, "resize-none")}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !name.trim() || !description.trim()}
              className="create-btn mt-2 justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Workflow"
              )}
            </button>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
