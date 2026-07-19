interface CodeBlockProps {
  code: string;
  label?: string;
}

export default function CodeBlock({ code, label }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/8 bg-black/40">
      {label && (
        <div className="border-b border-white/8 px-3 py-1.5 text-[11px] text-white/35">{label}</div>
      )}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-blue-200/90">
        {code}
      </pre>
    </div>
  );
}
