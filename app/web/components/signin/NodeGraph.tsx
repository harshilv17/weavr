const EDGES = [
  "M80,120 Q160,70 240,80",
  "M240,80 Q310,100 380,180",
  "M80,120 Q160,170 240,280",
  "M240,280 Q310,200 380,180",
  "M380,180 Q400,230 420,340",
  "M240,280 Q180,290 120,360",
];

const PARTICLES = [
  { d: "M80,120 Q160,70 240,80", dur: "3s" },
  { d: "M240,80 Q310,100 380,180", dur: "4.2s" },
  { d: "M80,120 Q160,170 240,280", dur: "5.4s" },
];

const NODES = [
  { cx: 80, cy: 120, label: "trigger" },
  { cx: 240, cy: 80, label: "api.fetch" },
  { cx: 380, cy: 180, label: "transform" },
  { cx: 240, cy: 280, label: "filter.map" },
  { cx: 420, cy: 340, label: "webhook.out" },
  { cx: 120, cy: 360, label: "notify.slack" },
];

export default function NodeGraph() {
  return (
    <div className="relative w-full h-[480px] flex items-center justify-center overflow-hidden">
      {/* ambient glows */}
      <div className="pointer-events-none absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(37,99,235,0.10)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-[15%] left-[5%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(30,40,80,0.25)_0%,transparent_70%)]" />

      <svg width="520" height="480" viewBox="0 0 520 480" fill="none" className="opacity-85">
        {EDGES.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="rgba(37,99,235,0.18)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 6"
          />
        ))}

        {PARTICLES.map(({ d, dur }, i) => (
          <circle key={i} r="3" fill="#2563EB" opacity="0.7">
            <animateMotion dur={dur} repeatCount="indefinite" path={d} />
          </circle>
        ))}

        {NODES.map(({ cx, cy, label }) => (
          <g key={label}>
            <circle
              cx={cx}
              cy={cy}
              r="22"
              fill="rgba(37,99,235,0.04)"
              stroke="rgba(37,99,235,0.12)"
              strokeWidth="1"
            />
            <circle
              cx={cx}
              cy={cy}
              r="14"
              fill="#111113"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <circle cx={cx} cy={cy} r="4" fill="#2563EB" opacity="0.8" />
            <text
              x={cx}
              y={cy + 34}
              textAnchor="middle"
              fontSize="10"
              fontFamily="'IBM Plex Mono', ui-monospace, monospace"
              fill="rgba(255,255,255,0.35)"
              letterSpacing="0.04em"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>

      {/* fade masks */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_top,#060608,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(to_bottom,#060608,transparent)]" />
    </div>
  );
}
