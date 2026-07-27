"use client";

import { useState } from "react";
import { orders as initialOrders, products } from "@/data/products";
import { Order, STATUS_NEXT } from "@/types";
import Topbar from "@/components/admin/topbar";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        return { ...o, status: STATUS_NEXT[o.status] };
      })
    );
  };

  return (
    <>
      <Topbar title="Pedidos" />
      <div className="p-6">
        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)]">
            <h2 className="text-lg font-semibold">Todos los pedidos</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">ID</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Cliente</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Productos</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Total</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Estado</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Fecha</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] w-28">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-3 text-xs font-mono">{o.id}</td>
                  <td className="px-5 py-3 text-sm">{o.customer}</td>
                  <td className="px-5 py-3 text-sm">{o.items} producto{o.items > 1 ? "s" : ""}</td>
                  <td className="px-5 py-3 text-sm">${o.total.toLocaleString("es-CL")}</td>
                  <td className="px-5 py-3 text-sm"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-xs text-[var(--color-meta)]">{o.date}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => updateStatus(o.id)} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]">
                      Actualizar
                    </button>
                  </td>
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
