import { Check, Loader2, X } from "lucide-react";
import DocsSection from "../DocsSection";

export default function LoggingSection() {
  return (
    <DocsSection
      id="logging"
      title="Logs & Debugging"
      description="The panel at the bottom of the builder shows what's happening as your workflow runs, in real time."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-white/8 bg-[#111114] p-4">
          <p className="text-[14px] font-medium text-[#f0eee9]">Selected Node tab</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
            Shows the output of whichever node you last clicked on the canvas, pretty-printed.
            Useful for checking one node&apos;s result without scrolling the full log.
          </p>
        </div>
        <div className="rounded-lg border border-white/8 bg-[#111114] p-4">
          <p className="text-[14px] font-medium text-[#f0eee9]">Run Log tab</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
            One row per node in the run, in execution order. A red badge on the tab shows how many
            nodes failed. Click a row to expand its full output or error.
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[13px] text-white/40">Status icons used in the Run Log:</p>
        <ul className="space-y-2 text-[13px] text-white/55">
          <li className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-blue-400" /> Running — the node is
            currently executing
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-emerald-400" /> Success — the node completed without
            errors
          </li>
          <li className="flex items-center gap-2">
            <X size={14} className="text-red-400" /> Failed — the node threw an error; expand the
            row to see the message
          </li>
        </ul>
      </div>

      <div className="text-[13.5px] leading-relaxed text-white/55">
        <p>
          Updates stream in live over a websocket as soon as the run starts, so you can watch each
          node go from running to success/failed without refreshing. Re-opening a workflow also
          loads the most recent run&apos;s log automatically, so you can debug a past run even after
          leaving the page.
        </p>
      </div>
    </DocsSection>
  );
}
