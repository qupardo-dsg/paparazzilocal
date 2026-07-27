import Link from "next/link";
import { orders, products } from "@/data/products";
import Topbar from "@/components/admin/topbar";
import KpiCard from "@/components/admin/kpi-card";

export default function AdminDashboardPage() {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pendiente");
  const today = new Date().toISOString().split("T")[0];
  const newToday = orders.filter((o) => o.date === today).length;
  const urgent = [...pending].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6">
        {/* Alerts */}
        {(urgent.length > 0) && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Alertas</h2>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {urgent.map((o) => {
                const days = Math.ceil((Date.now() - new Date(o.date).getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = days >= 5;
                return (
                  <Link
                    key={o.id}
                    href="/admin/pedidos"
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:shadow-sm ${
                      isUrgent
                        ? "bg-red-50 border-red-200 hover:bg-red-100"
                        : "bg-amber-50 border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isUrgent ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                      <div>
                        <p className="text-sm font-semibold">
                          {o.id} — {o.customer}
                        </p>
                        <p className="text-xs text-[var(--color-muted)] mt-0.5">
                          {isUrgent
                            ? `Urgente — ${days} días pendiente (envío 5-7 días)`
                            : `${days} día${days !== 1 ? "s" : ""} pendiente`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">${o.total.toLocaleString("es-CL")}</p>
                      <p className="text-xs text-[var(--color-muted)]">{o.date}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-[var(--color-muted)]">
              <span>{pending.length} pedidos pendientes</span>
              <span>{newToday} nuevos hoy</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Productos" value={String(products.length)} change="+3 este mes" trend="up" />
          <KpiCard label="Pedidos" value={String(orders.length)} change="+12% vs mes anterior" trend="up" />
          <KpiCard label="Ingresos" value={`$${totalRevenue.toLocaleString("es-CL")}`} change="+18% vs mes anterior" trend="up" />
          <KpiCard label="Pendientes" value={String(pending.length)} change="-2 desde ayer" trend="down" />
        </div>

        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ventas — últimos 30 días</h2>
          <SalesChart />
        </div>

        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)]">
            <h2 className="text-lg font-semibold">Pedidos recientes</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">ID</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Cliente</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Total</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Estado</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-3 text-xs font-mono">{o.id}</td>
                  <td className="px-5 py-3 text-sm">{o.customer}</td>
                  <td className="px-5 py-3 text-sm">${o.total.toLocaleString("es-CL")}</td>
                  <td className="px-5 py-3 text-sm"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-xs text-[var(--color-meta)]">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Entregado: "bg-green-100 text-green-800",
    "En camino": "bg-blue-100 text-blue-800",
    Pendiente: "bg-amber-100 text-amber-800",
    Cancelado: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-800"}`}>
      {status}
    </span>
  );
}

function SalesChart() {
  const bars = Array.from({ length: 30 }, () => Math.round((50000 + Math.random() * 90000) / 1000) * 1000);
  const max = Math.max(...bars) * 1.15;
  return (
    <div className="flex items-end gap-[3px] h-[260px]">
      {bars.map((v, i) => {
        const h = (v / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-sm transition-colors"
              style={{ height: `${h}%` }}
              title={`$${v.toLocaleString("es-CL")}`}
            />
            {i % 5 === 0 && <span className="text-[10px] text-[var(--color-meta)] mt-1">{i + 1}</span>}
          </div>
        );
      })}
    </div>
  );
}
