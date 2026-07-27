import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function Card({ className, children }: Props) {
  return (
    <div
      className={cn(
        "bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-lg shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
