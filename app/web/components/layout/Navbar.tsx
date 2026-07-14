"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Features", href: "/#features" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Docs", href: "/docs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1350px] transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6,6,8,0.78)" : "rgba(6,6,8,0.4)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        boxShadow: scrolled ? "0 12px 40px rgba(0,0,0,0.6)" : "0 4px 20px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      <div className="w-full px-8 flex items-center justify-between" style={{ height: 60 }}>
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 400,
                letterSpacing: "0.04em",
                padding: "6px 14px",
                borderRadius: 4,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.85)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/signin"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "color 0.2s ease, background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "#F0EEE9";
              (e.target as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)";
              (e.target as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            Sign in
          </a>
          <motion.a
            whileHover={{
              boxShadow: "0 0 0 1px rgba(37, 99, 235,0.6), 0 0 32px rgba(37, 99, 235,0.25)",
            }}
            whileTap={{ scale: 0.975 }}
            href="/signup"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 40,
              border: "1px solid rgba(37, 99, 235,0.35)",
              background: "rgba(37, 99, 235,0.08)",
              color: "#2563EB",
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Get Started Free
            <span style={{ fontSize: 12 }}>→</span>
          </motion.a>
        </div>

        <button className="md:hidden" style={{ color: "#71717A" }} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{ background: "rgba(6,6,8,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="px-8 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{ color: "#71717A", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}
                >
                  {link.label}
                </a>
              ))}
              <div
                className="pt-3 flex flex-col gap-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <a
                  href="/signin"
                  className="text-sm text-center py-2 rounded-xl"
                  style={{ color: "#71717A", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Sign in
                </a>
                <a
                  href="/signup"
                  className="text-sm text-center py-2 rounded-xl text-white font-medium"
                  style={{ background: "#2563EB" }}
                >
                  Get Started Free
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
