import { LogOut } from "lucide-react";
import Logo from "@/components/layout/Logo";

interface DashboardHeaderProps {
  signingOut: boolean;
  onSignOut: () => void;
}

export default function DashboardHeader({ signingOut, onSignOut }: DashboardHeaderProps) {
  return (
    <header
      className="dash-enter mb-10 flex items-center justify-between"
      style={{ animationDelay: "0ms" }}
    >
      <Logo href="/dashboard" />

      <button
        onClick={onSignOut}
        disabled={signingOut}
        className="flex items-center gap-2 rounded px-3 py-2 text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 disabled:opacity-50"
      >
        <LogOut size={14} />
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </header>
  );
}
