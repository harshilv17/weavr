"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const LENIS_DISABLED_ROUTES = ["/builder"];

export function LenisProvider() {
  const pathname = usePathname();
  const disabled = LENIS_DISABLED_ROUTES.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [disabled]);

  return null;
}
