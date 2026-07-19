import DocsSidebar from "./DocsSidebar";
import OverviewSection from "./sections/OverviewSection";
import NodesSection from "./sections/NodesSection";
import ConnectionsSection from "./sections/ConnectionsSection";
import DataFlowSection from "./sections/DataFlowSection";
import TriggersSection from "./sections/TriggersSection";
import LoggingSection from "./sections/LoggingSection";

export default function DocsClient() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl">
      <DocsSidebar />

      <main className="min-w-0 flex-1 px-6 py-12 sm:px-10">
        <div className="mb-12">
          <h1 className="font-display text-[32px] font-bold tracking-tight text-[#f0eee9]">
            Documentation
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-white/50">
            Everything you need to build, connect, and debug workflows in Weavr.
          </p>
        </div>

        <div className="space-y-12">
          <OverviewSection />
          <NodesSection />
          <ConnectionsSection />
          <DataFlowSection />
          <TriggersSection />
          <LoggingSection />
        </div>
      </main>
    </div>
  );
}
