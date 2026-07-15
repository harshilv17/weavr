"use client";

import { motion } from "motion/react";

/* ─── Static illustration data ──────────────────────────────────────────── */
const NODES = [
  { id: "webhook", label: "HTTP Webhook", type: "TRIGGER", status: "done" },
  { id: "auth", label: "Auth Guard", type: "VALIDATOR", status: "done" },
  { id: "ai", label: "AI Processor", type: "AI AGENT", status: "running" },
  { id: "router", label: "Route Logic", type: "CONDITION", status: "idle" },
  { id: "notify", label: "Slack Notify", type: "ACTION", status: "idle" },
] as const;

const STATUS_COLOR: Record<(typeof NODES)[number]["status"], string> = {
  done: "#22C55E",
  running: "#3B82F6",
  idle: "#3F3F46",
};

const STATS: [string, string][] = [
  ["50K+", "Automations"],
  ["99.9%", "Uptime"],
  ["120+", "Integrations"],
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Single soft background glow — static, no layered blurs */}
      <div
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[640px] h-[420px] pointer-events-none blur-[90px]"
        style={{
          background: "radial-gradient(ellipse, rgba(37,99,235,0.16) 0%, transparent 70%)",
        }}
      />

      {/* ── Headline ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 lg:pt-36 pb-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <h1 className="font-display font-extrabold leading-none tracking-[-0.04em] text-[#F0EEE9] mb-7 text-[clamp(3rem,10vw,8rem)]">
            Build Workflows
            <br />
            <span className="text-blue-500">That Think.</span>
          </h1>

          <p className="font-body font-light leading-[1.75] text-white/45 max-w-120 mb-11 text-[clamp(14px,4vw,18px)]">
            Orchestrate AI agents, connect any API, and automate production pipelines — without
            writing infrastructure code.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-11 w-full max-w-md sm:max-w-fit mx-auto">
            <a
              href="/signup"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-3 rounded px-9 py-4 font-display font-bold text-[0.92rem] tracking-[-0.01em] bg-blue-600 text-[#060608] transition-colors hover:bg-blue-500"
            >
              Start Building Free
              <span className="text-base">→</span>
            </a>
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {STATS.map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-[#FAFAFA] font-extrabold leading-none text-[clamp(0.95rem,2vw,1.05rem)]">
                  {v}
                </div>
                <div className="text-[#3F3F46] font-mono text-[0.6rem] tracking-widest mt-0.75">
                  {l.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Static product illustration ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 w-full"
      >
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Chrome */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full opacity-70" style={{ background: c }} />
                ))}
              </div>
              <span className="ml-3 text-[#3F3F46] font-mono text-[0.68rem] tracking-wider">
                customer-onboarding.flow
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/10 border border-blue-600/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-400 font-mono text-[0.62rem] tracking-wider">LIVE</span>
            </div>
          </div>

          {/* Flat node row — one straight flow, no SVG/particles */}
          <div className="flex flex-wrap items-center gap-3 p-6 sm:p-8">
            {NODES.map((n, i) => (
              <div key={n.id} className="flex items-center gap-3">
                <div
                  className="rounded-lg border px-4 py-3 min-w-[140px]"
                  style={{
                    borderColor: n.status === "running" ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)",
                    background: n.status === "running" ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: STATUS_COLOR[n.status] }}
                    />
                    <span className="text-[#3F3F46] font-mono text-[0.58rem] tracking-[0.08em]">
                      {n.type}
                    </span>
                  </div>
                  <div className="text-white/85 font-body text-[0.8rem] font-medium">{n.label}</div>
                </div>
                {i < NODES.length - 1 && <span className="text-white/15 text-lg">→</span>}
              </div>
            ))}
          </div>

          {/* Footer bar */}
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.02]">
            <span className="text-[#3F3F46] font-mono text-[0.62rem]">5 nodes · 4 edges</span>
            <span className="text-green-500 font-mono text-[0.62rem]">● RUNNING</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
