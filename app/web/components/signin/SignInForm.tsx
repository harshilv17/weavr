"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
import { useMe } from "@/hooks/useMe";
import { sendVerificationEmail } from "@/services/auth/sendVerification";

const inputCls = cn(
  "w-full rounded px-4 py-3 text-sm text-[#f0eee9]",
  "placeholder:text-white/25 outline-none",
  "bg-white/5 border border-white/[0.06]",
  "transition-[border-color,box-shadow]",
  "focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/20",
);

const DEMO_ACCOUNTS = [
  { label: "Demo · Account 1", email: "demo1@weavr.app", password: "Demo@1234" },
  { label: "Demo · Account 2", email: "demo2@weavr.app", password: "Demo@1234" },
  { label: "Demo · Account 3", email: "demo3@weavr.app", password: "Demo@1234" },
];

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const { user, loading: meLoading, route } = useMe();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  //handle form change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function doSignIn(email: string, password: string) {
    const res = await api.post("/v1/auth/signin", { email, password });
    if (res.data.data.isVerified === false) {
      await sendVerificationEmail(email);
      router.push(`/verification/${email}`);
    } else {
      router.push("/dashboard");
    }
  }

  //handle submit form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await doSignIn(form.email, form.password);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Something went wrong. Please try again.")
        : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  //one-click demo login
  async function handleDemoLogin(email: string, password: string) {
    setDemoLoading(email);
    try {
      await doSignIn(email, password);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Demo login failed. Please try again.")
        : "Demo login failed. Please try again.";
      toast.error(message);
    } finally {
      setDemoLoading(null);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* email */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.04em] text-zinc-400"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className={inputCls}
        />
      </div>

      {/* password */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.04em] text-zinc-400"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className={cn(inputCls, "pr-11 placeholder:tracking-[0.2em]")}
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
      </div>

      {/* forgot */}
      {/* <div className="mb-6 flex items-center justify-between">
        <Link href="/forgot-password" className="text-[13px] text-blue-600 hover:underline">
          Forgot password?
        </Link>
      </div> */}

      {/* primary CTA */}
      <button
        type="submit"
        disabled={loading}
        className="signin-cta mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in…" : "Continue"}
      </button>

      {/* demo accounts */}
      <div className="mt-6 border-t border-white/[0.06] pt-5">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.04em] text-zinc-400">
          Just here to look around?
        </p>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((acct) => (
            <button
              key={acct.email}
              type="button"
              disabled={demoLoading !== null}
              onClick={() => handleDemoLogin(acct.email, acct.password)}
              className="flex w-full items-center justify-between rounded border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-left text-[13px] text-white/70 transition-colors hover:border-blue-600/40 hover:bg-blue-600/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{acct.label}</span>
              <span className="text-white/30">
                {demoLoading === acct.email ? "Signing in…" : acct.email}
              </span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
