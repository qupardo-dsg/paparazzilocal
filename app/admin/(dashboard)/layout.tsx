import Sidebar from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-60 flex-1 bg-[var(--color-surface-warm)]">{children}</main>
    </div>
  );
}
