"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products as initialProducts, orders } from "@/data/products";
import { CATEGORIES, Product } from "@/types";
import Topbar from "@/components/admin/topbar";
import { formatPrice } from "@/lib/utils";

let nextId = 25;
const PER_PAGE = 10;

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageParam = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(pageParam);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editId?: number }>({ open: false });
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", sku: "" });

  const activeOrderProductIds = useMemo(() => {
    const active = orders.filter((o) => o.status === "Pendiente" || o.status === "En camino");
    return new Set(active.flatMap((o) => o.productIds));
  }, []);

  const counts = CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: products.filter((p) => p.category === cat).length }),
    {} as Record<string, number>
  );

  const filtered = products.filter((p) => {
    if (filter && p.category !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const goToPage = (p: number) => {
    setPage(p);
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const openModal = (id?: number) => {
    if (id) {
      const p = products.find((pr) => pr.id === id)!;
      setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), sku: p.sku });
      setModal({ open: true, editId: id });
    } else {
      setForm({ name: "", category: "", price: "", stock: "", sku: "" });
      setModal({ open: true });
    }
  };

  const save = () => {
    const { name, category, price, stock, sku } = form;
    if (!name || !category || !price || !stock || !sku) return alert("Completa todos los campos");
    if (modal.editId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === modal.editId
            ? { ...p, name, category: category as Product["category"], price: Number(price), stock: Number(stock), sku, updated: today() }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: nextId++,
        name,
        category: category as Product["category"],
        price: Number(price),
        stock: Number(stock),
        sku,
        updated: today(),
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setModal({ open: false });
  };

  const remove = (id: number) => {
    if (activeOrderProductIds.has(id)) return;
    if (!confirm("¿Eliminar este producto?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const hasActiveOrders = (id: number) => activeOrderProductIds.has(id);

  return (
    <>
      <Topbar title="Productos" />
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <button
            onClick={() => { setFilter(""); setSearch(""); setPage(1); goToPage(1); }}
            className={`bg-white border rounded-xl p-4 text-center transition-colors ${!filter ? "border-[var(--color-accent)] bg-amber-50" : "border-[var(--color-border-soft)] hover:border-[var(--color-accent)]"}`}
          >
            <div className="text-sm font-semibold">Todos</div>
            <div className="text-xs text-[var(--color-meta)] mt-1">{products.length} productos</div>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setSearch(""); setPage(1); goToPage(1); }}
              className={`bg-white border rounded-xl p-4 text-center transition-colors ${filter === cat ? "border-[var(--color-accent)] bg-amber-50" : "border-[var(--color-border-soft)] hover:border-[var(--color-accent)]"}`}
            >
              <div className="text-sm font-semibold">{cat}</div>
              <div className="text-xs text-[var(--color-meta)] mt-1">{counts[cat] || 0} productos</div>
            </button>
          ))}
        </div>

        <div className="bg-white border border-[var(--color-border-soft)] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--color-border-soft)] flex-wrap gap-3">
            <h2 className="text-lg font-semibold">{filter || "Todos los productos"}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[var(--color-surface-warm)] border border-[var(--color-border-soft)] rounded-md px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Buscar..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); goToPage(1); }} className="bg-transparent outline-none text-sm w-36" />
              </div>
              <button onClick={() => openModal()} className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors">
                + Agregar
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Producto</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Categoría</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Precio</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Stock</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] w-44">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--color-surface-warm)] rounded flex items-center justify-center text-[var(--color-meta)] shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-xs text-[var(--color-meta)]">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm"><span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{p.category}</span></td>
                  <td className="px-5 py-3 text-sm">${formatPrice(p.price)}</td>
                  <td className="px-5 py-3 text-sm">{p.stock}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2 items-center">
                      <button onClick={() => openModal(p.id)} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]">Editar</button>
                      {hasActiveOrders(p.id) ? (
                        <span className="text-xs text-amber-600" title="Tiene pedidos activos">Pedidos activos</span>
                      ) : (
                        <button onClick={() => remove(p.id)} className="text-sm text-[var(--color-danger)] hover:underline">Eliminar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6">
            <button onClick={() => goToPage(1)} disabled={currentPage <= 1} className="min-w-[32px] h-8 border border-[var(--color-border-soft)] rounded text-xs font-semibold flex items-center justify-center disabled:opacity-30 hover:border-[var(--color-accent)] transition-colors">«</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} className="min-w-[32px] h-8 border border-[var(--color-border-soft)] rounded text-xs font-semibold flex items-center justify-center disabled:opacity-30 hover:border-[var(--color-accent)] transition-colors">‹</button>
            <span className="text-xs text-[var(--color-meta)] px-2">
              {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} de {filtered.length}
            </span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className="min-w-[32px] h-8 border border-[var(--color-border-soft)] rounded text-xs font-semibold flex items-center justify-center disabled:opacity-30 hover:border-[var(--color-accent)] transition-colors">›</button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage >= totalPages} className="min-w-[32px] h-8 border border-[var(--color-border-soft)] rounded text-xs font-semibold flex items-center justify-center disabled:opacity-30 hover:border-[var(--color-accent)] transition-colors">»</button>
          </div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setModal({ open: false })}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-[90%] max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-5">{modal.editId ? "Editar producto" : "Agregar producto"}</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Nombre</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]" placeholder="Nombre del producto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Categoría</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]">
                    <option value="">Seleccionar</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Precio</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Stock inicial</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]" placeholder="0" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">SKU</label>
                  <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 outline-none focus:border-[var(--color-accent)]" placeholder="Ej: PERF-001" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-[var(--color-border-soft)]">
              <button onClick={() => setModal({ open: false })} className="bg-[var(--color-surface-elevated)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-border-soft)]">Cancelar</button>
              <button onClick={save} className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-hover)]">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function today() {
  return new Date().toISOString().split("T")[0];
}
