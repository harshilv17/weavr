import LeftPanel from "@/components/signin/LeftPanel";
import SignUpCard from "@/components/signup/SignUpCard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Weavr workspace and start building AI workflows for free.",
  alternates: { canonical: "/signup" },
};

export default function SignUpPage() {
  return (
    <>
      <style>{`
        @keyframes blob-drift-1 {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(40px,-30px) scale(1.08); }
          66%      { transform:translate(-20px,20px) scale(0.96); }
        }
        @keyframes blob-drift-2 {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(-50px,30px) scale(1.05); }
          66%      { transform:translate(30px,-20px) scale(0.98); }
        }
        @keyframes signup-card-enter {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          from { transform:translateX(-100%); }
          to   { transform:translateX(200%); }
        }
        .signup-blob-1 { animation:blob-drift-1 30s ease-in-out infinite; }
        .signup-blob-2 { animation:blob-drift-2 35s ease-in-out infinite; }
        .signup-card   { animation:signup-card-enter 450ms ease-out 80ms both; }
        .signup-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size:72px 72px;
          transform:rotate(1.5deg);
          transform-origin:center;
        }
        .signup-cta {
          position:relative; overflow:hidden;
          background:#2563eb; border:none; border-radius:4px;
          padding:15px 36px; width:100%;
          font-family:var(--font-display,'Space Grotesk',sans-serif);
          font-weight:700; font-size:15px;
          color:#060608; letter-spacing:-0.01em;
          cursor:pointer;
          transition:opacity 150ms ease;
        }
        .signup-cta:hover { opacity:0.9; }
        .signup-cta::after {
          content:"";
          position:absolute; top:0; left:0; width:50%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
          animation:shimmer 2.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion:reduce) {
          .signup-blob-1,.signup-blob-2,.signup-card { animation:none !important; }
          .signup-cta::after { animation:none !important; }
        }

        /* reuse signin animations for LeftPanel blobs */
        .signin-blob-1 { animation:blob-drift-1 25s ease-in-out infinite; }
        .signin-blob-2 { animation:blob-drift-2 30s ease-in-out infinite; }
        .signin-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size:72px 72px;
          transform:rotate(1.5deg);
          transform-origin:center;
        }
      `}</style>

      <div className="relative flex min-h-screen w-full overflow-hidden bg-[#060608] text-[#f0eee9]">
        {/* blueprint grid */}
        <div className="signup-grid pointer-events-none absolute inset-[-10%] h-[120%] w-[120%] z-0" />

        {/* ambient blobs */}
        <div className="signup-blob-1 pointer-events-none absolute z-0 rounded-full -top-[120px] -right-[120px] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,rgba(37,99,235,0.06)_40%,transparent_70%)]" />
        <div className="signup-blob-2 pointer-events-none absolute z-0 rounded-full -bottom-[150px] -left-[150px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(30,45,100,0.22)_0%,transparent_65%)]" />

        {/* left — identical to signin */}
        <LeftPanel />

        {/* right — scrollable to fit longer form */}
        <div className="relative z-10 flex w-[580px] shrink-0 items-start justify-center overflow-y-auto px-10 py-12">
          <SignUpCard />
        </div>
      </div>
    </>
  );
}
