"use client";

import { useState } from "react";
import { products as initialProducts } from "@/data/products";
import Topbar from "@/components/admin/topbar";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState(initialProducts);

  const adjustStock = (id: number) => {
    const p = products.find((pr) => pr.id === id);
    if (!p) return;
    const qty = prompt(`Ajustar stock de "${p.name}" (actual: ${p.stock})`, String(p.stock));
    if (qty !== null && !isNaN(parseInt(qty))) {
      setProducts((prev) =>
        prev.map((pr) =>
          pr.id === id ? { ...pr, stock: Math.max(0, parseInt(qty)), updated: new Date().toISOString().split("T")[0] } : pr
        )
      );
    }
  };

  return (
    <>
      <Topbar title="Inventario" />
      <div className="p-6">
        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)]">
            <h2 className="text-lg font-semibold">Inventario</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Producto</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">SKU</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Stock</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Nivel</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Última actualización</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] w-28">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const pct = Math.min(100, (p.stock / 30) * 100);
                const barColor = p.stock <= 5 ? "var(--color-danger)" : p.stock <= 10 ? "var(--color-warn)" : "var(--color-success)";
                return (
                  <tr key={p.id} className="hover:bg-[var(--color-surface)]">
                    <td className="px-5 py-3 text-sm font-semibold">{p.name}</td>
                    <td className="px-5 py-3 text-xs font-mono text-[var(--color-meta)]">{p.sku}</td>
                    <td className={`px-5 py-3 text-sm font-semibold ${p.stock <= 5 ? "text-[var(--color-danger)]" : p.stock <= 10 ? "" : "text-[var(--color-success)]"}`}>{p.stock}</td>
                    <td className="px-5 py-3">
                      <div className="w-20 h-1.5 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-[var(--color-meta)]">{p.updated}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => adjustStock(p.id)} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]">
                        Ajustar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
