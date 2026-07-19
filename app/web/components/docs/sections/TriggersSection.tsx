import DocsSection from "../DocsSection";
import CodeBlock from "../CodeBlock";

export default function TriggersSection() {
  return (
    <DocsSection
      id="triggers"
      title="Triggers"
      description="Every workflow starts with exactly one trigger node, set to one of three types."
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-[14px] font-medium text-[#f0eee9]">Manual</h3>
          <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">
            Runs the workflow immediately when you click <span className="text-white/80">Run</span>{" "}
            in the trigger&apos;s config panel. No external input — downstream nodes see the
            trigger&apos;s stored config as-is.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-medium text-[#f0eee9]">Webhook</h3>
          <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">
            Save the workflow to generate a unique webhook URL, shown in the trigger&apos;s config
            panel with a copy button. Any HTTP POST to that URL queues a run.
          </p>
          <CodeBlock
            label="Webhook URL format"
            code={"POST {backend_URL}/v1/webhooks/{webhookToken}"}
          />
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
            The posted body, query string, and headers are all available to later nodes:
          </p>
          <CodeBlock
            code={[
              "{{trigger.body...}}     → JSON body of the POST request",
              "{{trigger.query...}}    → URL query parameters",
              "{{trigger.headers...}}  → request headers",
            ].join("\n")}
          />
        </div>

        <div>
          <h3 className="text-[14px] font-medium text-[#f0eee9]">Schedule (Cron)</h3>
          <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">
            Set an interval in seconds (minimum 60) and click{" "}
            <span className="text-white/80">Start</span>. The workflow then runs automatically on
            that interval until you click <span className="text-white/80">Stop</span>. The panel
            shows whether the schedule is currently running.
          </p>
        </div>
      </div>
    </DocsSection>
  );
}
