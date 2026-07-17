import type { WorkflowItem } from "./types";

interface WorkflowStatsProps {
  workflows: WorkflowItem[];
  loading?: boolean;
}

export default function WorkflowStats({ workflows, loading }: WorkflowStatsProps) {
  const activeCount = workflows.filter((w) => w.status === "active").length;

  return (
    <section className="dash-enter mb-8" style={{ animationDelay: "60ms" }}>
      <h1 className="mb-1 text-[28px] font-bold tracking-[-0.03em] text-[#f0eee9]">Workflows</h1>
      {loading ? (
        <div className="h-[17px] w-40 animate-pulse rounded bg-white/[0.06]" />
      ) : (
        <p className="text-[13px] text-white/35">
          <span className="font-medium text-blue-500">{workflows.length}</span> total workflows
          {" · "}
          <span className="font-medium text-green-400">{activeCount}</span> active
        </p>
      )}
    </section>
  );
}
