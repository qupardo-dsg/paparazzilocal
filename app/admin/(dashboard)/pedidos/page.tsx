"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { orders as initialOrders, products as productList } from "@/data/products";
import { Order, ORDER_STATUSES, STATUS_NEXT } from "@/types";
import Topbar from "@/components/admin/topbar";
import OrderStatusModal from "@/components/admin/order-status-modal";
import OrderDetailModal from "@/components/admin/order-detail-modal";

const PER_PAGE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState<keyof Order | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusModal, setStatusModal] = useState<Order | null>(null);
  const [detailModal, setDetailModal] = useState<Order | null>(null);

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === "Pendiente"), [orders]);
  const today = new Date().toISOString().split("T")[0];
  const newToday = orders.filter((o) => o.date === today).length;
  const urgent = useMemo(
    () => [...pendingOrders].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5),
    [pendingOrders]
  );

  const toggleSort = (field: keyof Order) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortField(null); setSortDir("asc"); }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const sortIcon = (field: keyof Order) => {
    if (sortField !== field) return <span className="text-[var(--color-meta)] ml-1">⇅</span>;
    return <span className="text-[var(--color-fg)] ml-1">{sortDir === "asc" ? "▲" : "▼"}</span>;
  };

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter) result = result.filter((o) => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q) ||
          o.date.includes(q)
      );
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField];
        const bv = b[sortField];
        if (typeof av === "string" && typeof bv === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
        return 0;
      });
    }
    return result;
  }, [orders, statusFilter, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const updateStatus = (id: string, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id !== id ? o : { ...o, status: STATUS_NEXT[o.status] }))
    );
    setStatusModal(null);
  };

  return (
    <>
      <Topbar title="Pedidos" />
      <div className="p-6">
        {/* Urgency alerts */}
        {urgent.length > 0 && (
          <div className="mb-5 space-y-2">
            {urgent.map((o) => {
              const days = Math.ceil((Date.now() - new Date(o.date).getTime()) / (1000 * 60 * 60 * 24));
              const isUrgent = days >= 5;
              return (
                <div
                  key={o.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isUrgent ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isUrgent ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                    <div>
                      <p className="text-sm font-semibold">{o.id} — {o.customer}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        {isUrgent ? `Urgente — ${days} días pendiente (envío 5-7 días)` : `${days} día${days !== 1 ? "s" : ""} pendiente`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">${o.total.toLocaleString("es-CL")}</p>
                      <p className="text-xs text-[var(--color-muted)]">{o.date}</p>
                    </div>
                    <button onClick={() => setStatusModal(o)} className="text-xs bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-3 py-1 font-semibold hover:bg-[var(--color-accent-hover)] transition-colors">
                      Marcar enviado
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-4 text-xs text-[var(--color-muted)] pt-1">
              <span>{pendingOrders.length} pendientes</span>
              <span>{newToday} nuevos hoy</span>
              <span>{orders.length} total</span>
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className="mb-5 bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--color-border-soft)]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Pedidos recientes</h2>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead><tr className="text-left">
                <th className="px-5 py-2 text-xs font-semibold text-[var(--color-muted)]">ID</th>
                <th className="px-5 py-2 text-xs font-semibold text-[var(--color-muted)]">Cliente</th>
                <th className="px-5 py-2 text-xs font-semibold text-[var(--color-muted)]">Total</th>
                <th className="px-5 py-2 text-xs font-semibold text-[var(--color-muted)]">Estado</th>
                <th className="px-5 py-2 text-xs font-semibold text-[var(--color-muted)]">Fecha</th>
              </tr></thead>
              <tbody>
                {[...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--color-surface)]">
                    <td className="px-5 py-2 text-xs font-mono cursor-pointer hover:text-[var(--color-accent)]" onClick={() => setDetailModal(o)}>{o.id}</td>
                    <td className="px-5 py-2 text-sm">{o.customer}</td>
                    <td className="px-5 py-2 text-sm">${o.total.toLocaleString("es-CL")}</td>
                    <td className="px-5 py-2 text-sm"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-2 text-xs text-[var(--color-meta)]">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--color-border-soft)] flex-wrap gap-3">
            <h2 className="text-lg font-semibold">Todos los pedidos</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[var(--color-surface-warm)] border border-[var(--color-border-soft)] rounded-md px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Buscar pedido..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="bg-transparent outline-none text-sm w-40" />
              </div>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-[var(--color-surface-elevated)] rounded-md px-3 py-2 text-sm outline-none cursor-pointer">
                <option value="">Todos los estados</option>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("id")}>
                    ID{sortIcon("id")}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("customer")}>
                    Cliente{sortIcon("customer")}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("items")}>
                    Productos{sortIcon("items")}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("total")}>
                    Total{sortIcon("total")}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("status")}>
                    Estado{sortIcon("status")}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("date")}>
                    Fecha{sortIcon("date")}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] w-28">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--color-surface)]">
                    <td className="px-5 py-3 text-xs font-mono cursor-pointer hover:text-[var(--color-accent)]" onClick={() => setDetailModal(o)}>{o.id}</td>
                    <td className="px-5 py-3 text-sm">{o.customer}</td>
                    <td className="px-5 py-3 text-sm">{o.items} producto{o.items > 1 ? "s" : ""}</td>
                    <td className="px-5 py-3 text-sm">${o.total.toLocaleString("es-CL")}</td>
                    <td className="px-5 py-3 text-sm"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-xs text-[var(--color-meta)]">{o.date}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => setStatusModal(o)} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]">
                        Actualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6">
            <button onClick={() => setPage(1)} disabled={currentPage <= 1} className="min-w-[32px] h-8 border border-[var(--color-border-soft)] rounded text-xs font-semibold flex items-center justify-center disabled:opacity-30 hover:border-[var(--color-accent)] transition-colors">«</button>
            <button onClick={() => setPage(currentPage - 1)} disabled={currentPage <= 1} className="min-w-[32px] h-8 border border-[var(--color-border-soft)] rounded text-xs font-semibold flex items-center justify-center disabled:opacity-30 hover:border-[var(--color-accent)] transition-colors">‹</button>
            <span className="text-xs text-[var(--color-meta)] px-2">
              {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} de {filtered.length}
            </span>
            <button onClick={() => setPage(currentPage + 1)} disabled={currentPage >= totalPages} className="min-w-[32px] h-8 border border-[var(--color-border-soft)] rounded text-xs font-semibold flex items-center justify-center disabled:opacity-30 hover:border-[var(--color-accent)] transition-colors">›</button>
            <button onClick={() => setPage(totalPages)} disabled={currentPage >= totalPages} className="min-w-[32px] h-8 border border-[var(--color-border-soft)] rounded text-xs font-semibold flex items-center justify-center disabled:opacity-30 hover:border-[var(--color-accent)] transition-colors">»</button>
          </div>
        )}
      </div>

      {statusModal && (
        <OrderStatusModal
          order={statusModal}
          onClose={() => setStatusModal(null)}
          onConfirm={updateStatus}
        />
      )}

      {detailModal && (
        <OrderDetailModal
          order={detailModal}
          products={productList}
          onClose={() => setDetailModal(null)}
        />
      )}
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
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-800"}`}>{status}</span>;
}
