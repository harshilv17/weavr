import Logo from "@/components/layout/Logo";

const LINKS: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Integrations", href: "/#integrations" },
    { label: "Documentation", href: "/docs" },
  ],
  Account: [
    { label: "Sign in", href: "/signin" },
    { label: "Get started", href: "/signup" },
    { label: "Dashboard", href: "/dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-[#060608] border-t border-[rgba(255,255,255,0.05)] py-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2">
            <div className="mb-5">
              <Logo size="sm" />
            </div>
            <p className="font-body font-light text-[0.82rem] leading-[1.7] text-[rgba(255,255,255,0.2)] max-w-[250px] mb-5">
              Visual workflow automation for teams that move fast. Build, deploy, and monitor
              AI-powered pipelines at production scale.
            </p>
          </div>

          {Object.entries(LINKS).map(([cat, links]) => (
            <div key={cat}>
              <div className="font-display font-semibold text-[0.78rem] tracking-[0.06em] text-[rgba(255,255,255,0.5)] uppercase mb-4">
                {cat}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-body font-light text-[0.8rem] text-[rgba(255,255,255,0.18)] hover:text-[rgba(255,255,255,0.6)] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[rgba(255,255,255,0.04)] pt-8 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-full bg-[#22C55E] animate-pulse" />
            <span className="font-mono text-[0.6rem] tracking-[0.06em] text-[rgba(255,255,255,0.14)]">
              All systems nominal
            </span>
          </div>

          <span className="font-mono text-[0.6rem] text-[rgba(255,255,255,0.1)]">
            © 2026 Weavr, Inc.
          </span>
        </div>
      </div>
    </footer>
  );
}
