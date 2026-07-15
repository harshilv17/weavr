"use client";

import { motion } from "motion/react";
import { Workflow, Shield, Clock } from "lucide-react";

const PILLS = [
  { icon: <Shield size={11} />, label: "SOC 2 Type II" },
  { icon: <Workflow size={11} />, label: "No credit card required" },
  { icon: <Clock size={11} />, label: "Deploy in minutes" },
  { icon: <Shield size={11} />, label: "99.9% SLA" },
  { icon: <Workflow size={11} />, label: "Free tier forever" },
];

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 sm:py-40 bg-blue-600/[0.04] border-t border-blue-600/10 border-b border-blue-600/[0.06]">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-10 bg-blue-500/[0.06] border border-blue-500/20">
            <Workflow size={11} className="text-blue-500" />
            <span className="font-mono text-[10px] font-semibold tracking-[0.06em] text-blue-400/90 uppercase select-none">
              Deploy your first workflow in under 5 minutes
            </span>
          </div>

          <h2 className="font-display text-[clamp(40px,7vw,88px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#F0EEE9] mb-6">
            Ship faster.
            <br />
            <span className="text-blue-500">Break less.</span>
          </h2>

          <p className="max-w-[500px] mx-auto mb-12 font-body text-[1.05rem] leading-[1.72] text-white/40">
            Create workflows, orchestrate AI agents, and automate business operations from one
            unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="/signup"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-3 rounded px-9 py-4 font-display font-bold text-[0.92rem] tracking-[-0.01em] bg-blue-600 text-[#060608] transition-colors hover:bg-blue-500"
            >
              Start Building Free
              <span className="text-base">→</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
            {PILLS.map((p, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06]"
              >
                <span className="text-emerald-500/80">{p.icon}</span>
                <span className="font-sans text-[11px] font-medium tracking-wide text-zinc-400/85 select-none">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
