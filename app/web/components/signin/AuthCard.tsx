import Link from "next/link";
import SignInForm from "./SignInForm";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Documentation", href: "/docs" },
  { label: "Help Center", href: "/help" },
];

export default function AuthCard() {
  return (
    <div
      className={[
        "signin-card w-[480px] rounded-lg p-12",
        "bg-white/[0.03] backdrop-blur-[20px] backdrop-saturate-[160%]",
        "[border-top:1px_solid_rgba(255,255,255,0.10)]",
        "[border-left:1px_solid_rgba(255,255,255,0.06)]",
        "[border-right:1px_solid_rgba(255,255,255,0.03)]",
        "[border-bottom:1px_solid_rgba(255,255,255,0.02)]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
      ].join(" ")}
    >
      <h1 className="mb-2 text-[32px] font-bold tracking-[-0.04em] leading-tight font-display">
        <span className="text-[#f0eee9]">Welcome </span>
        <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(37,99,235,0.7)]">
          back
        </span>
      </h1>
      <p className="mb-8 mt-2 text-sm font-light leading-relaxed text-white/40">
        Build, automate, and scale workflows with powerful visual automation.
      </p>

      <SignInForm />

      <div className="mt-7 pt-6 border-t border-white/[0.04]">
        <p className="mb-2.5 text-center text-[13px] font-light text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-normal text-blue-600 hover:underline">
            Create one →
          </Link>
        </p>
        <p className="flex flex-wrap justify-center gap-1.5 text-[12px] font-light text-white/28">
          {FOOTER_LINKS.map(({ label, href }, i, arr) => (
            <span key={label} className="flex items-center gap-1.5">
              <Link href={href} className="text-white/30 hover:text-white/50 transition-colors">
                {label}
              </Link>
              {i < arr.length - 1 && <span className="opacity-30">·</span>}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
