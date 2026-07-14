import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0a0a0d] text-center text-[#f0eee9]">
      <h1 className="text-2xl font-semibold">Workflow not found</h1>
      <p className="text-[13px] text-white/40">
        The workflow you&apos;re looking for doesn&apos;t exist or was deleted.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/[0.08]"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
