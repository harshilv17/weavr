import DocsSection from "../DocsSection";
import CodeBlock from "../CodeBlock";

export default function DataFlowSection() {
  return (
    <DocsSection
      id="data-flow"
      title="Passing Data Between Nodes"
      description="When a workflow runs, every node's output is kept in memory so any later node can reference it."
    >
      <div className="space-y-3 text-[13.5px] leading-relaxed text-white/55">
        <p>
          Reference an earlier node&apos;s output from any text field (Prompt, Body, Message, URL,
          Headers, etc.) using double curly braces:
        </p>
      </div>

      <CodeBlock label="Template syntax" code={"{{nodeId.path.to.field}}"} />

      <div className="space-y-3 text-[13.5px] leading-relaxed text-white/55">
        <p>
          <span className="font-mono text-white/80">nodeId</span> is the ID of the node whose output
          you want (shown in the Run Log and in the node config panel).{" "}
          <span className="font-mono text-white/80">path.to.field</span> walks into that node&apos;s
          output object.
        </p>
        <p>
          The trigger node is always available under the fixed key{" "}
          <span className="font-mono text-white/80">trigger</span>, regardless of its node ID — this
          is the only node whose reference key never changes.
        </p>
      </div>

      <CodeBlock
        label="Examples"
        code={[
          "{{trigger.body.email}}          → a field from a webhook's JSON body",
          "{{trigger.query.userId}}        → a query string param from a webhook call",
          "{{node-3.choices.0.message.content}}  → an AI node's model response",
        ].join("\n")}
      />

      <div className="space-y-3 text-[13.5px] leading-relaxed text-white/55">
        <p>
          If a field&apos;s value is <em>exactly</em> one placeholder, the resolved value keeps its
          original type (object, number, etc.). If a placeholder is embedded inside a longer string,
          it&apos;s inserted as text.
        </p>
      </div>
    </DocsSection>
  );
}
