import Link from "next/link";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-border-soft)] px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>
      <Link
        href="/"
        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
      >
        Ver tienda
      </Link>
    </header>
  );
}
