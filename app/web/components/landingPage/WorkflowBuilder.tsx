"use client";

import { motion } from "motion/react";
import { Globe, Clock, Cpu, Filter, GitBranch, MessageSquare, Play, Settings } from "lucide-react";

const PALETTE = [
  { icon: Globe, name: "HTTP Webhook" },
  { icon: Clock, name: "Cron Schedule" },
  { icon: Cpu, name: "AI Processor" },
  { icon: Filter, name: "Transform" },
  { icon: GitBranch, name: "Condition" },
  { icon: MessageSquare, name: "Slack" },
];

const FLOW = [
  { icon: Clock, label: "Daily Schedule", type: "CRON", status: "done" as const },
  { icon: Globe, label: "Fetch Leads", type: "HTTP", status: "done" as const },
  { icon: Cpu, label: "AI Enrichment", type: "AI AGENT", status: "running" as const },
  { icon: Filter, label: "Score Lead", type: "TRANSFORM", status: "idle" as const },
];

const INSPECTOR_FIELDS = [
  { label: "MODEL", val: "gpt-4o", accent: true },
  { label: "TEMPERATURE", val: "0.3", accent: false },
  { label: "TOOLS", val: "6 active", accent: false },
];

const FEATURES = [
  { title: "Infinite Canvas", desc: "Pan, zoom, and organize any workflow" },
  { title: "Live Execution Trace", desc: "Watch data flow node-by-node in real time" },
  { title: "Git-native Versioning", desc: "Branch, diff, and revert any workflow" },
  { title: "Multi-cursor Editing", desc: "Collaborate simultaneously like Figma" },
];

const CARD_STYLE = "bg-white/[0.03] border border-white/[0.08] rounded-lg";

export function WorkflowBuilder() {
  return (
    <section id="features" className="relative pt-20 pb-24 overflow-hidden bg-transparent">
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-[#FAFAFA] tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.1] pb-4">
            Build <span className="text-blue-500">anything, visually</span>
          </h2>
          <p className="font-body font-light text-white/40 text-[0.95rem] leading-[1.8] max-w-[460px] mx-auto">
            A professional workflow canvas that feels like a real IDE — drag-and-drop, live
            execution tracing, and instant deployment.
          </p>
        </motion.div>

        {/* Builder window */}
        <div className={`overflow-hidden ${CARD_STYLE}`}>
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B0B0C] border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full opacity-70" style={{ background: c }} />
                ))}
              </div>
              <span className="text-[#3F3F46] font-mono text-[0.62rem] ml-2">
                lead-enrichment.flow · saved
              </span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-green-600">
              <Play size={10} /> Deploy
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Palette */}
            <div className="flex-shrink-0 md:w-44 border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#0A0A0B] p-3">
              <div className="text-[#3F3F46] font-mono text-[0.58rem] tracking-[0.08em] mb-2 px-1">
                NODES
              </div>
              <div className="flex flex-row md:flex-col flex-wrap gap-1">
                {PALETTE.map(({ icon: Icon, name }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-[#71717A] text-[0.73rem] font-body"
                  >
                    <Icon size={12} className="text-blue-500/70 flex-shrink-0" />
                    <span className="whitespace-nowrap">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flow canvas */}
            <div className="flex-1 flex flex-wrap items-center gap-3 p-5">
              {FLOW.map((node, i) => {
                const Icon = node.icon;
                const isRunning = node.status === "running";
                return (
                  <div key={node.label} className="flex items-center gap-3">
                    <div
                      className="rounded-md border px-3 py-2.5 min-w-[140px]"
                      style={{
                        borderColor: isRunning ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)",
                        background: isRunning ? "rgba(59,130,246,0.07)" : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={12} className="text-blue-500/80" />
                        <span className="text-[#E4E4E7] font-body text-[0.72rem] font-medium">
                          {node.label}
                        </span>
                      </div>
                      <span className="text-[#3F3F46] font-mono text-[0.57rem]">{node.type}</span>
                    </div>
                    {i < FLOW.length - 1 && <span className="text-white/15">→</span>}
                  </div>
                );
              })}
            </div>

            {/* Inspector */}
            <div className="flex-shrink-0 md:w-52 border-t md:border-t-0 md:border-l border-white/[0.06] bg-[#0A0A0B] p-4">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
                <Settings size={11} className="text-[#3F3F46]" />
                <span className="text-[#3F3F46] font-mono text-[0.6rem] tracking-[0.07em]">
                  NODE CONFIG
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 flex items-center justify-center rounded-md border border-blue-500/30 text-blue-500">
                  <Cpu size={13} />
                </div>
                <div>
                  <div className="text-[#FAFAFA] font-body text-[0.8rem] font-medium">
                    AI Enrichment
                  </div>
                  <div className="text-blue-500 font-mono text-[0.58rem]">Running · 1.6s</div>
                </div>
              </div>
              {INSPECTOR_FIELDS.map((field) => (
                <div key={field.label} className="mb-2.5">
                  <div className="text-[#3F3F46] font-mono text-[0.57rem] tracking-[0.07em] mb-1">
                    {field.label}
                  </div>
                  <div
                    className="px-2.5 py-1.5 rounded font-mono text-[0.7rem]"
                    style={{
                      background: field.accent ? "rgba(37,99,235,0.08)" : "rgba(255,255,255,0.03)",
                      color: field.accent ? "#3B82F6" : "#71717A",
                    }}
                  >
                    {field.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2 bg-[#0A0A0B] border-t border-white/[0.05]">
            <span className="text-[#3F3F46] font-mono text-[0.6rem]">6 nodes · 3/6 done</span>
            <span className="text-[#3F3F46] font-mono text-[0.6rem]">Autosaved 1s ago</span>
          </div>
        </div>

        {/* Feature callouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8">
          {FEATURES.map((feature) => (
            <div key={feature.title} className={`p-4 ${CARD_STYLE}`}>
              <div className="text-[#D4D4D8] font-body text-[0.82rem] font-medium mb-1">
                {feature.title}
              </div>
              <div className="text-white/40 font-body font-light text-[0.75rem]">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
