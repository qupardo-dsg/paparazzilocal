import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <>
      <div className="border-b border-[var(--color-border-soft)] px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <Link href="/" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]">Ver tienda</Link>
      </div>
      <div className="p-6">
        <p className="text-[var(--color-muted)]">Panel de administración PaparazziLocal.</p>
      </div>
    </>
  );
}
