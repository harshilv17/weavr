import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  label: string;
  aspect?: "video" | "wide" | "square";
}

const ASPECT_CLASS: Record<NonNullable<ImagePlaceholderProps["aspect"]>, string> = {
  video: "aspect-video",
  wide: "aspect-[21/9]",
  square: "aspect-square",
};

export default function ImagePlaceholder({ label, aspect = "video" }: ImagePlaceholderProps) {
  return (
    <div
      className={`flex ${ASPECT_CLASS[aspect]} w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-center`}
    >
      <ImageIcon size={20} className="text-white/25" />
      <p className="max-w-xs px-4 text-[12px] text-white/35">{label}</p>
    </div>
  );
}
