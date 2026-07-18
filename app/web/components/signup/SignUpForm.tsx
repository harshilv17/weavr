"use client";
import axios from "axios";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useMe } from "@/hooks/useMe";
import { Eye, EyeOff, Shield, Mail, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── shared input class ──────────────────────────────────────────────── */
const inputCls = cn(
  "w-full rounded px-4 py-3 text-sm text-[#f0eee9]",
  "placeholder:text-white/25 outline-none",
  "bg-white/5 border border-white/[0.06]",
  "transition-[border-color,box-shadow]",
  "focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/20",
);

/* ── password strength ───────────────────────────────────────────────── */
const RULES = [
  { id: "length", label: "Minimum 8 characters", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "lower", label: "Lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { id: "number", label: "Number", test: (v: string) => /\d/.test(v) },
  {
    id: "special",
    label: "Special character (!@#$%^&*)",
    test: (v: string) => /[!@#$%^&*]/.test(v),
  },
];

const STRENGTH_BAR = [
  "",
  "bg-red-500",
  "bg-blue-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-green-500",
];
const STRENGTH_TEXT = [
  "",
  "text-red-500",
  "text-blue-500",
  "text-blue-500",
  "text-green-500",
  "text-green-500",
];
const STRENGTH_LABEL = ["", "WEAK", "FAIR", "FAIR", "STRONG", "STRONG"];

function PasswordStrength({ password }: { password: string }) {
  const passed = RULES.filter((r) => r.test(password)).length;

  return (
    <div className="mt-2.5">
      <div className="mb-1.5 flex items-center gap-1">
        {RULES.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-[3px] flex-1 rounded-full transition-colors duration-300",
              i < passed ? STRENGTH_BAR[passed] : "bg-white/[0.08]",
            )}
          />
        ))}
        {passed > 0 && (
          <span
            className={cn(
              "ml-2 shrink-0 font-mono text-[10px] tracking-[0.06em] whitespace-nowrap",
              STRENGTH_TEXT[passed],
            )}
          >
            {STRENGTH_LABEL[passed]}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <div key={rule.id} className="flex items-center gap-2">
              {ok ? (
                <Check size={12} className="shrink-0 text-green-500" />
              ) : (
                <X size={12} className="shrink-0 text-red-500/60" />
              )}
              <span
                className={cn(
                  "text-[12px] leading-[1.8]",
                  ok ? "text-green-500 line-through" : "text-white/30",
                )}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── field wrapper ───────────────────────────────────────────────────── */
function Field({
  label,
  optionalTag,
  children,
}: {
  label: string;
  optionalTag?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400">
        {label}
        {optionalTag && (
          <span className="ml-1 normal-case tracking-normal font-normal text-white/30">
            (optional)
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

/* ── trust badges ────────────────────────────────────────────────────── */
const TRUST_BADGES = [
  {
    label: "Secure Auth",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    label: "E2E Encryption",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </svg>
    ),
  },
  {
    label: "GDPR Ready",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20" />
      </svg>
    ),
  },
  {
    label: "Enterprise",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 12h4m-4-4h4m0 13v-3a2 2 0 0 0-4 0v3" />
        <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
        <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      </svg>
    ),
  },
  {
    label: "Open Source",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 16 4-4-4-4M6 8l-4 4 4 4m8.5-12-5 16" />
      </svg>
    ),
  },
  {
    label: "Self-Host",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="8" x="2" y="2" rx="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" />
        <path d="M6 6h.01M6 18h.01" />
      </svg>
    ),
  },
];

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Documentation", href: "/docs" },
  { label: "Contact Support", href: "/support" },
];

/* ── main form ───────────────────────────────────────────────────────── */
export default function SignUpForm() {
  const { user, loading: meLoading, route } = useMe();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  //handle input change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword" || name === "password") setPasswordError("");
  }

  //handle submit.
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/v1/auth/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      router.push("/signin");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Something went wrong. Please try again.")
        : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      {/* divider */}
      <div className="mb-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-600 whitespace-nowrap">
          register with email
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      {/* fields */}
      <div className="flex flex-col gap-5">
        {/* username */}
        <Field label="Username">
          <input
            type="text"
            name="username"
            placeholder="johndoe"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            className={inputCls}
          />
        </Field>

        {/* email */}
        <Field label="Email">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={cn(inputCls, "pr-10 placeholder:tracking-[0.15em]")}
            />
          </div>
        </Field>

        {/* password */}
        <Field label="Password">
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••••"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className={cn(inputCls, "pr-11 placeholder:tracking-[0.15em]")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.password.length > 0 && <PasswordStrength password={form.password} />}
        </Field>

        {/* confirm password */}
        <Field label="Confirm Password">
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••••"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={cn(
              inputCls,
              "placeholder:tracking-[0.15em]",
              passwordError && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            )}
          />
          {passwordError && <p className="mt-1.5 text-[12px] text-red-500">{passwordError}</p>}
        </Field>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={loading}
        className="signup-cta mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating…" : "Create Workspace"}
      </button>

      {/* footer */}
      <div className="mt-6 border-t border-white/[0.04] pt-5 pb-2">
        <p className="mb-3 text-center text-[13px] text-white/45">
          Already have an account?{" "}
          <Link href="/signin" className="font-normal text-blue-600 hover:underline">
            Sign In →
          </Link>
        </p>
        <p className="flex flex-wrap justify-center gap-1.5 text-[11px] font-light text-white/28">
          {FOOTER_LINKS.map(({ label, href }, i, arr) => (
            <span key={label} className="flex items-center gap-1.5">
              <Link href={href} className="text-white/28 hover:text-white/50 transition-colors">
                {label}
              </Link>
              {i < arr.length - 1 && <span className="opacity-40">·</span>}
            </span>
          ))}
        </p>
      </div>
    </form>
  );
}
