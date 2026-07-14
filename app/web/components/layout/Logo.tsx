import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md";
}

const BAR_SIZES: Record<
  NonNullable<LogoProps["size"]>,
  { width: number; height: number; gap: number }
> = {
  sm: { width: 20, height: 2, gap: 3 },
  md: { width: 24, height: 3, gap: 5 },
};

const TEXT_SIZE: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-[15px]",
  md: "text-[21px]",
};

export default function Logo({ href = "/", size = "sm" }: LogoProps) {
  const bar = BAR_SIZES[size];

  const mark = (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-col" style={{ gap: bar.gap, width: bar.width }}>
        <div
          className="rounded-full bg-blue-600"
          style={{ height: bar.height, width: bar.width }}
        />
        <div
          className="rounded-full bg-blue-800/75"
          style={{ height: bar.height, width: bar.width * 0.7 }}
        />
        <div
          className="rounded-full bg-blue-900/45"
          style={{ height: bar.height, width: bar.width * 0.4 }}
        />
      </div>
      <span
        className={`font-display font-bold tracking-tight text-[#f0eee9] leading-none ${TEXT_SIZE[size]}`}
      >
        Async<span className="text-blue-600">Node</span>
      </span>
    </div>
  );

  return <Link href={href}>{mark}</Link>;
}
