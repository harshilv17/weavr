import type { ReactNode } from "react";

interface DocsSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function DocsSection({ id, title, description, children }: DocsSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-white/8 pb-12">
      <h2 className="font-display text-[22px] font-bold tracking-tight text-[#f0eee9]">{title}</h2>
      {description && (
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/50">{description}</p>
      )}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
