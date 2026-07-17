import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowToolbarProps {
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateClick: () => void;
}

export default function WorkflowToolbar({ search, onSearch, onCreateClick }: WorkflowToolbarProps) {
  return (
    <div className="dash-enter mb-6 flex items-center gap-3" style={{ animationDelay: "100ms" }}>
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search workflows…"
          value={search}
          onChange={onSearch}
          className={cn(
            "w-full rounded px-4 py-2.5 pl-9 text-[13px] text-[#f0eee9]",
            "placeholder:text-white/25 outline-none",
            "bg-white/5 border border-white/[0.06]",
            "transition-[border-color,box-shadow]",
            "focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/20",
          )}
        />
      </div>

      <button className="create-btn" onClick={onCreateClick}>
        <Plus size={14} />
        Create Workflow
      </button>
    </div>
  );
}
