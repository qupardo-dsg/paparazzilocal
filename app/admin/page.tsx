import { orders, products } from "@/data/products";
import Topbar from "@/components/admin/topbar";
import KpiCard from "@/components/admin/kpi-card";

export default function AdminDashboardPage() {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pendiente").length;

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Productos" value={String(products.length)} change="+3 este mes" trend="up" />
          <KpiCard label="Pedidos" value={String(orders.length)} change="+12% vs mes anterior" trend="up" />
          <KpiCard label="Ingresos" value={`$${totalRevenue.toLocaleString("es-CL")}`} change="+18% vs mes anterior" trend="up" />
          <KpiCard label="Pendientes" value={String(pending)} change="-2 desde ayer" trend="down" />
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
