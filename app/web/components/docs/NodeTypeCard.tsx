import type { LucideIcon } from "lucide-react";

interface NodeTypeCardProps {
  icon: LucideIcon;
  color: string;
  name: string;
  description: string;
  fields: { name: string; detail: string }[];
}

export default function NodeTypeCard({
  icon: Icon,
  color,
  name,
  description,
  fields,
}: NodeTypeCardProps) {
  return (
    <div className="rounded-lg border border-white/8 bg-[#111114] p-4">
      <div className="flex items-center gap-3">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${color}1f`, color }}
        >
          <Icon size={16} />
        </div>
        <div>
          <p className="text-[14px] font-medium text-[#f0eee9]">{name}</p>
          <p className="text-[12px] text-white/40">{description}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 border-t border-white/8 pt-3">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="w-32 shrink-0 font-mono text-[11.5px] text-white/60">{field.name}</dt>
            <dd className="text-[12.5px] text-white/40">{field.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
