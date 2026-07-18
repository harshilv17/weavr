import SignUpForm from "./SignUpForm";

export default function SignUpCard() {
  return (
    <div
      className={[
        "signup-card w-[480px] rounded-lg p-12",
        "bg-white/[0.03] backdrop-blur-[20px] backdrop-saturate-[160%]",
        "[border-top:1px_solid_rgba(255,255,255,0.10)]",
        "[border-left:1px_solid_rgba(255,255,255,0.06)]",
        "[border-right:1px_solid_rgba(255,255,255,0.03)]",
        "[border-bottom:1px_solid_rgba(255,255,255,0.02)]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
      ].join(" ")}
    >
      <h1 className="mb-2 text-[32px] font-bold tracking-[-0.04em] leading-tight font-display">
        <span className="text-[#f0eee9]">Create your </span>
        <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(37,99,235,0.7)]">
          workspace
        </span>
      </h1>
      <p className="mb-8 mt-2 text-sm font-light leading-relaxed text-white/40">
        Join thousands of developers building powerful workflow automations with Weavr.
      </p>

      <SignUpForm />
    </div>
  );
}
