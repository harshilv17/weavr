export default function DashboardBackground() {
  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          from { transform:translateX(-100%); }
          to   { transform:translateX(200%); }
        }
        .dash-enter { animation: fade-up 350ms ease-out both; }
        .create-btn {
          position:relative; overflow:hidden;
          background:#2563eb; border:none; border-radius:4px;
          padding:10px 20px;
          font-family:var(--font-display,'Space Grotesk',sans-serif);
          font-weight:700; font-size:13px;
          color:#060608; letter-spacing:-0.01em;
          cursor:pointer; display:inline-flex; align-items:center; gap:6px;
          transition:opacity 150ms ease;
          white-space:nowrap;
        }
        .create-btn:hover { opacity:0.9; }
        .create-btn::after {
          content:"";
          position:absolute; top:0; left:0; width:55%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          animation:shimmer 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ambient blobs */}
      <div className="pointer-events-none absolute -top-[120px] -right-[120px] z-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,rgba(37,99,235,0.04)_40%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[150px] -left-[100px] z-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(30,45,100,0.18)_0%,transparent_65%)]" />
    </>
  );
}
