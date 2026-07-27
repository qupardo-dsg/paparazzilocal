"use client";

import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

type Props = {
  order: Order;
  onClose: () => void;
};

export default function OrderDetailModal({ order, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-[520px] w-[90%] max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Detalle del pedido</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-surface)] rounded transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-[var(--color-surface)] rounded-lg">
          <div><p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Pedido</p><p className="text-sm font-mono font-semibold">{order.id}</p></div>
          <div><p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Cliente</p><p className="text-sm font-semibold">{order.customer}</p></div>
          <div><p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Fecha</p><p className="text-sm">{order.createdAt?.split("T")[0]}</p></div>
          <div><p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Estado</p><StatusBadge status={order.status} /></div>
          <div><p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Total</p><p className="text-sm font-bold">${formatPrice(order.total)}</p></div>
        </div>

        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Productos comprados</h3>
        <div className="space-y-2">
          {order.items.map((item) => {
            const p = item.product;
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-lg">
                <div className="w-10 h-10 bg-[var(--color-surface-warm)] rounded flex items-center justify-center text-[var(--color-meta)] shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p ? p.name : `Producto #${item.productId}`}</p>
                  {p && <p className="text-xs text-[var(--color-meta)]">{p.category} · SKU: {p.sku}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-[var(--color-muted)]">x{item.quantity}</p>
                  <p className="text-sm font-semibold">${formatPrice(item.price)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-[var(--color-border-soft)]">
          <span className="text-sm text-[var(--color-muted)]">{order.items.length} producto{order.items.length !== 1 ? "s" : ""}</span>
          <span className="text-lg font-bold">Total: ${formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "En espera de confirmación": "bg-amber-100 text-amber-800",
    "Pagado": "bg-indigo-100 text-indigo-800",
    "Pendiente de envío": "bg-blue-100 text-blue-800",
    "En camino": "bg-cyan-100 text-cyan-800",
    "Entregado": "bg-green-100 text-green-800",
    "Cancelado": "bg-red-100 text-red-800",
  };
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || ""}`}>{status}</span>;
}
