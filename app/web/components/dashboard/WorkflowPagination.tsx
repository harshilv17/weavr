import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAGE_SIZE } from "./types";

interface WorkflowPaginationProps {
  page: number;
  totalPages: number;
  filteredCount: number;
  onPageChange: (page: number) => void;
}

export default function WorkflowPagination({
  page,
  totalPages,
  filteredCount,
  onPageChange,
}: WorkflowPaginationProps) {
  const rangeStart = Math.min((page - 1) * PAGE_SIZE + 1, filteredCount);
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredCount);

  return (
    <div
      className="dash-enter flex items-center justify-between"
      style={{ animationDelay: "200ms" }}
    >
      <p className="text-[12px] text-white/30">
        Showing{" "}
        <span className="text-white/55">
          {rangeStart}–{rangeEnd}
        </span>{" "}
        of <span className="text-white/55">{filteredCount}</span> workflows
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.06] text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "flex h-8 min-w-[32px] items-center justify-center rounded border px-2 text-[12px] font-medium transition-colors",
              page === p
                ? "border-blue-600/50 bg-blue-600/10 text-blue-500"
                : "border-white/[0.06] text-white/40 hover:bg-white/5 hover:text-white/70",
            )}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.06] text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
