import LogoMark from "./LogoMark";
import NodeGraph from "./NodeGraph";

const BADGES = ["99.9% Uptime", "SOC 2 Type II", "GDPR Ready", "< 50ms Latency"];

function MonoBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono rounded px-[10px] py-1 text-[11px] tracking-[0.06em] text-blue-600/70 bg-blue-600/[0.06] border border-blue-600/[0.18]">
      {children}
    </span>
  );
}

export default function LeftPanel() {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 py-16 border-r border-white/[0.04]">
      <div className="absolute top-10 left-12">
        <LogoMark />
      </div>

      <div className="w-full max-w-[560px]">
        <NodeGraph />
      </div>

      <div className="mt-8 text-center">
        <p className="mb-2.5 font-display text-[22px] font-semibold tracking-tight text-[#f0eee9]">
          Visual workflow automation
        </p>
        <p className="mx-auto max-w-[360px] text-sm font-light leading-relaxed text-white/40">
          Connect APIs, transform data, and automate complex pipelines — without writing a single
          line of boilerplate.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {BADGES.map((badge) => (
          <MonoBadge key={badge}>{badge}</MonoBadge>
        ))}
      </div>
    </div>
  );
}
