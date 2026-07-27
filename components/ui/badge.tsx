import { cn } from "@/lib/utils";

type Props = {
  variant?: "success" | "warn" | "danger" | "info";
  className?: string;
  children: React.ReactNode;
};

export default function Badge({ variant = "info", className, children }: Props) {
  const variants = {
    success: "bg-green-100 text-green-800",
    warn: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
