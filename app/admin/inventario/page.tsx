"use client";

import { useState, useMemo } from "react";
import { products as initialProducts, stockHistory as initialHistory } from "@/data/products";
import { CATEGORIES, StockHistoryEntry } from "@/types";
import Topbar from "@/components/admin/topbar";
import { formatPrice } from "@/lib/utils";

const HISTORY_PER_PAGE = 5;

export default function AdminInventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [history, setHistory] = useState<StockHistoryEntry[]>(initialHistory);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [stockModal, setStockModal] = useState<{ open: boolean; productId?: number }>({ open: false });
  const [stockForm, setStockForm] = useState({ current: 0, change: "", reason: "" });

  const filtered = products.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const productMap = useMemo(() => {
    const map = new Map<number, string>();
    products.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [products]);

  const totalHistoryPages = Math.ceil(history.length / HISTORY_PER_PAGE);
  const currentHPage = Math.max(1, Math.min(historyPage, totalHistoryPages || 1));
  const paginatedHistory = history.slice((currentHPage - 1) * HISTORY_PER_PAGE, currentHPage * HISTORY_PER_PAGE);

  const openStockModal = (id: number) => {
    const p = products.find((pr) => pr.id === id);
    if (!p) return;
    setStockForm({ current: p.stock, change: "", reason: "" });
    setStockModal({ open: true, productId: id });
  };

  const closeStockModal = () => setStockModal({ open: false });

  const saveStockAdjust = () => {
    const { change, reason } = stockForm;
    const amount = parseInt(change);
    if (isNaN(amount) || amount === 0) return alert("Ingresa un cambio válido");
    if (!reason.trim()) return alert("Ingresa un motivo");

    const p = products.find((pr) => pr.id === stockModal.productId);
    if (!p) return;

    const newStock = Math.max(0, p.stock + amount);
    const entry: StockHistoryEntry = {
      date: now(),
      productId: p.id,
      oldStock: p.stock,
      newStock,
      reason: reason.trim(),
    };

    setProducts((prev) =>
      prev.map((pr) => (pr.id === p.id ? { ...pr, stock: newStock, updated: new Date().toISOString().split("T")[0] } : pr))
    );
    setHistory((prev) => [entry, ...prev]);
    setHistoryPage(1);
    closeStockModal();
  };

  return (
    <>
      <Topbar title="Inventario" />
      <div className="p-6">
        {/* Stock history */}
        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)]">
            <h2 className="text-lg font-semibold">Historial de cambios</h2>
          </div>
          {history.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[var(--color-muted)]">Sin movimientos registrados.</p>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Fecha</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Producto</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Anterior</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Nuevo</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Cambio</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistory.map((h, i) => (
                    <tr key={i} className="hover:bg-[var(--color-surface)]">
                      <td className="px-5 py-3 text-xs text-[var(--color-meta)] font-mono">{h.date}</td>
                      <td className="px-5 py-3 text-sm font-semibold">{productMap.get(h.productId) || `#${h.productId}`}</td>
                      <td className="px-5 py-3 text-sm">{h.oldStock}</td>
                      <td className="px-5 py-3 text-sm">{h.newStock}</td>
                      <td className={`px-5 py-3 text-sm font-semibold ${h.newStock > h.oldStock ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                        {h.newStock > h.oldStock ? "+" : ""}{h.newStock - h.oldStock}
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--color-meta)]">{h.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalHistoryPages > 1 && (
                <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-[var(--color-border-soft)]">
                  <button onClick={() => setHistoryPage(currentHPage - 1)} disabled={currentHPage <= 1} className="px-3 py-1 text-sm border rounded-md disabled:opacity-30 hover:bg-[var(--color-surface)]">Anterior</button>
                  {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setHistoryPage(p)} className={`w-7 h-7 text-xs rounded-md ${p === currentHPage ? "bg-[var(--color-accent)] text-[var(--color-accent-on)] font-semibold" : "hover:bg-[var(--color-surface)]"}`}>{p}</button>
                  ))}
                  <button onClick={() => setHistoryPage(currentHPage + 1)} disabled={currentHPage >= totalHistoryPages} className="px-3 py-1 text-sm border rounded-md disabled:opacity-30 hover:bg-[var(--color-surface)]">Siguiente</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Inventory table */}
        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--color-border-soft)] flex-wrap gap-3">
            <h2 className="text-lg font-semibold">Inventario</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[var(--color-surface-warm)] border border-[var(--color-border-soft)] rounded-md px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-40" />
              </div>
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="bg-[var(--color-surface-elevated)] rounded-md px-3 py-2 text-sm outline-none cursor-pointer">
                <option value="">Todas las categorías</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Producto</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">SKU</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Stock</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Nivel</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Precio</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Última actualización</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] w-28">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
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
                    <td className="px-5 py-3 text-sm">${formatPrice(p.price)}</td>
                    <td className="px-5 py-3 text-xs text-[var(--color-meta)]">{p.updated}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => openStockModal(p.id)} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]">Ajustar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Stock adjust modal */}
        {stockModal.open && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={closeStockModal}>
            <div className="bg-white rounded-xl shadow-xl max-w-[420px] w-[90%] p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-5">Ajustar stock</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Stock actual</label>
                  <input type="number" value={stockForm.current} disabled className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none bg-[var(--color-surface-warm)] text-[var(--color-muted)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Cambio (+ entrada, - salida)</label>
                  <input
                    type="number"
                    value={stockForm.change}
                    onChange={(e) => setStockForm({ ...stockForm, change: e.target.value })}
                    placeholder="0"
                    className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]"
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Nuevo stock</label>
                  <input
                    type="number"
                    value={Math.max(0, stockForm.current + (parseInt(stockForm.change) || 0))}
                    disabled
                    className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none bg-[var(--color-surface-warm)] text-[var(--color-muted)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Motivo</label>
                  <textarea
                    value={stockForm.reason}
                    onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                    placeholder="Ej: reposición de proveedor, ajuste de inventario..."
                    rows={2}
                    className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)] resize-y min-h-[56px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-[var(--color-border-soft)]">
                <button onClick={closeStockModal} className="bg-[var(--color-surface-elevated)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-border-soft)]">Cancelar</button>
                <button onClick={saveStockAdjust} className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-hover)]">Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function now() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
