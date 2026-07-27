"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  variant?: "primary" | "ghost" | "secondary" | "danger";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
  type = "button",
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 font-[family-name:var(--font-display)] transition-all duration-200 rounded-full font-normal";
  const variants = {
    primary: "bg-[var(--color-fg)] text-white border-2 border-transparent hover:opacity-90",
    ghost: "bg-transparent text-[var(--color-fg)] border-2 border-[var(--color-fg)] hover:bg-[var(--color-fg)] hover:text-white",
    secondary: "bg-[var(--color-surface-elevated)] text-[var(--color-fg)] hover:bg-[var(--color-border-soft)]",
    danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
  };
  const sizes = {
    sm: "text-xs px-3 py-1",
    md: "text-base px-6 py-3",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
