import DocsSection from "../DocsSection";

export default function OverviewSection() {
  return (
    <DocsSection
      id="overview"
      title="Overview"
      description="Weavr workflows are directed graphs of nodes. Each workflow starts at exactly one trigger node, flows through any number of action nodes, and runs top to bottom in the order your connections define."
    >
      <ul className="list-disc space-y-1.5 pl-5 text-[13.5px] text-white/55">
        <li>Drag a node from the sidebar onto the canvas to add it to your workflow.</li>
        <li>
          Connect nodes by dragging from one node&apos;s output handle to the next node&apos;s input
          handle.
        </li>
        <li>Click a node to open its configuration panel on the right.</li>
        <li>Save your workflow, then run it manually, via webhook, or on a schedule.</li>
        <li>
          Watch execution status and output live in the log panel at the bottom of the builder.
        </li>
      </ul>
    </DocsSection>
  );
}
