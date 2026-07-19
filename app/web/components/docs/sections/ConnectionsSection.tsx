import DocsSection from "../DocsSection";

export default function ConnectionsSection() {
  return (
    <DocsSection
      id="connections"
      title="Connecting Nodes"
      description="Connections define both execution order and how data moves through your workflow."
    >
      <div className="space-y-3 text-[13.5px] leading-relaxed text-white/55">
        <p>
          To connect two nodes, drag from the small dot on the right edge of a node (its output) to
          the dot on the left edge of another node (its input).
        </p>
        <p>A few rules keep workflows unambiguous:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Every node can have{" "}
            <span className="text-white/80">at most one outgoing connection</span> and{" "}
            <span className="text-white/80">at most one incoming connection</span>.
          </li>
          <li>A node cannot connect to itself.</li>
          <li>
            The <span className="text-white/80">Trigger</span> node has no input handle — it can
            only be the start of a workflow and can never receive an incoming connection.
          </li>
        </ul>
        <p>
          Invalid connections (e.g. dragging a second connection into an already-connected node, or
          into a trigger) are rejected automatically by the canvas — you&apos;ll simply see the
          connection line snap back.
        </p>
      </div>
    </DocsSection>
  );
}
