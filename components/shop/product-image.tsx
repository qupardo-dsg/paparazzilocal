import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "w-10 h-10 text-[10px]",
  md: "w-20 h-20 text-xs",
  lg: "w-48 h-48 text-sm",
  xl: "w-full aspect-square text-base",
};

export default function ProductImage({ src, alt, size = "md", className }: Props) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg bg-[var(--color-surface)]", sizes[size], className)}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-[var(--color-surface-warm)] to-[var(--color-surface)] flex items-center justify-center text-[var(--color-meta)] rounded-lg border border-[var(--color-border-soft)]",
        sizes[size],
        className
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={size === "xl" ? "w-20 h-20" : size === "lg" ? "w-16 h-16" : "w-8 h-8"}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    </div>
  );
}
