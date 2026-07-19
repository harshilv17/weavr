"use client";

import Link from "next/link";
import Logo from "@/components/layout/Logo";

export const DOCS_NAV = [
  { id: "overview", label: "Overview" },
  { id: "nodes", label: "Node Types" },
  { id: "connections", label: "Connecting Nodes" },
  { id: "data-flow", label: "Passing Data Between Nodes" },
  { id: "triggers", label: "Triggers" },
  { id: "logging", label: "Logs & Debugging" },
] as const;

export default function DocsSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-white/8 px-5 py-8 lg:flex">
      <div className="mb-10">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1">
        <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-white/30">
          Documentation
        </p>
        {DOCS_NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded px-2 py-1.5 text-[13px] text-white/50 transition-colors hover:bg-white/5 hover:text-white/90"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <Link
        href="/dashboard"
        className="mt-auto rounded px-2 py-1.5 text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
      >
        ← Back to dashboard
      </Link>
    </aside>
  );
}
