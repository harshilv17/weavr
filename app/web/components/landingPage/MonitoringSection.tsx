"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Terminal } from "lucide-react";

interface LogEntry {
  ts: string;
  level: "INFO" | "WARN" | "ERROR";
  id: string;
  msg: string;
}

interface MetricItem {
  label: string;
  val: string;
  delta: string;
  good: boolean;
}

const LOGS: LogEntry[] = [
  { ts: "14:23:01.043", level: "INFO", id: "wf_8x3a1", msg: "Workflow started: customer-onboarding-v3" },
  { ts: "14:23:01.121", level: "INFO", id: "wf_8x3a1", msg: "Node [HTTP Webhook] → payload received 2.4KB" },
  { ts: "14:23:01.891", level: "INFO", id: "wf_8x3a1", msg: "Node [AI Processor] → invoking gpt-4o" },
  {
    ts: "14:23:04.901",
    level: "WARN",
    id: "wf_8x3a1",
    msg: "Node [Score Lead] → confidence 0.62 < threshold 0.70",
  },
  { ts: "14:23:05.231", level: "INFO", id: "wf_8x3a1", msg: "Node [Slack Notify] → sent to #sales-signals" },
  {
    ts: "14:23:05.312",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Workflow complete: 4.269s · 11 nodes · 0 errors",
  },
  { ts: "14:23:05.891", level: "ERROR", id: "wf_7b2f9", msg: "Node [PostgreSQL] → timeout 5000ms, retry 1/3" },
];

const METRICS: MetricItem[] = [
  { label: "Avg Exec Time", val: "1.84s", delta: "-12%", good: true },
  { label: "Error Rate", val: "0.18%", delta: "-3%", good: true },
  { label: "P99 Latency", val: "4.2s", delta: "+0.1s", good: false },
  { label: "Throughput", val: "842/min", delta: "+28%", good: true },
];

const LEVEL_COLOR: Record<LogEntry["level"], string> = {
  ERROR: "#EF4444",
  WARN: "#F59E0B",
  INFO: "#71717A",
};

export function MonitoringSection() {
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const filteredLogs = filterLevel === "ALL" ? LOGS : LOGS.filter((log) => log.level === filterLevel);

  return (
    <section className="relative py-28 overflow-hidden bg-transparent">
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-extrabold text-[#FAFAFA] tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.1] mb-4">
            Debug any failure in <span className="text-blue-500">seconds</span>
          </h2>
          <p className="font-body font-light text-white/40 text-[0.95rem] leading-[1.8] max-w-[460px] mx-auto">
            Step-by-step execution traces, real-time log streaming, and performance analytics — all
            in one place.
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.08]"
            >
              <div className="font-sans text-[10px] tracking-wider font-semibold text-zinc-500 uppercase mb-3.5">
                {metric.label}
              </div>
              <div className="font-space text-[2.2rem] font-extrabold tracking-[0.02em] text-white leading-none">
                {metric.val}
              </div>
              <div className="flex items-center justify-between mt-3.5">
                <span className="font-mono text-xs text-zinc-600">vs last 24h</span>
                <span
                  className={`font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    metric.good
                      ? "text-emerald-500 bg-emerald-500/8 border-emerald-500/15"
                      : "text-red-500 bg-red-500/8 border-red-500/15"
                  }`}
                >
                  {metric.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal */}
        <div className="overflow-hidden rounded-lg bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full opacity-70" style={{ background: c }} />
                ))}
              </div>
              <Terminal size={11} className="text-[#3F3F46] ml-1.5" />
              <span className="text-[#3F3F46] font-mono text-[0.68rem]">weavr / execution-logs</span>
            </div>
            <div className="flex items-center gap-2.5">
              {["ALL", "INFO", "WARN", "ERROR"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className="px-2 py-0.5 rounded text-[0.58rem] font-mono transition-colors"
                  style={{
                    background: filterLevel === lvl ? "rgba(37,99,235,0.1)" : "transparent",
                    color: filterLevel === lvl ? "#3B82F6" : "#3F3F46",
                    border: filterLevel === lvl ? "1px solid rgba(37,99,235,0.25)" : "1px solid transparent",
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div className="pb-2.5 mb-4 border-b border-white/[0.04] font-mono text-[0.68rem]">
              <span className="text-blue-500">async</span>
              <span className="text-[#3F3F46]"> node </span>
              <span className="text-[#52525B]">$ tail -f /logs/execution.log --filter=wf_8x3a1</span>
            </div>

            {filteredLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-1.5 font-mono">
                <span className="text-[#3F3F46] text-[0.6rem] min-w-[82px] flex-shrink-0">{log.ts}</span>
                <span
                  className="px-1.5 py-0.5 rounded flex-shrink-0 text-[0.56rem] min-w-[38px] text-center"
                  style={{ background: `${LEVEL_COLOR[log.level]}10`, color: LEVEL_COLOR[log.level] }}
                >
                  {log.level}
                </span>
                <span className="text-[#3F3F46] text-[0.6rem] min-w-[62px] flex-shrink-0">{log.id}</span>
                <span
                  className="text-[0.68rem] leading-[1.5]"
                  style={{ color: log.level === "ERROR" ? "#EF4444" : log.level === "WARN" ? "#F59E0B" : "#52525B" }}
                >
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
