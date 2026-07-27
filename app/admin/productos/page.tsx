"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { orders } from "@/data/products";
import { CATEGORIES, Product } from "@/types";
import Topbar from "@/components/admin/topbar";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/shop/product-image";
import ConfirmModal from "@/components/admin/confirm-modal";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}

function AdminProductsContent() {
  const PER_PAGE = 10;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageParam = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(pageParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?showDisabled=true")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [modal, setModal] = useState<{ open: boolean; editId?: number }>({ open: false });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", sku: "", image: "" });

  const orderProductIds = useMemo(() => {
    return new Set(orders.flatMap((o) => o.productIds));
  }, []);

  const toggleSort = (field: keyof Product) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortField(null); setSortDir("asc"); }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
    goToPage(1);
  };

  const sortIcon = (field: keyof Product) => {
    if (sortField !== field) return <span className="text-[var(--color-meta)] ml-1">⇅</span>;
    return <span className="text-[var(--color-fg)] ml-1">{sortDir === "asc" ? "▲" : "▼"}</span>;
  };

  const counts = CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: products.filter((p) => p.category === cat).length }),
    {} as Record<string, number>
  );

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (filter && p.category !== filter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
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
  }, [products, filter, search, sortField, sortDir]);

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
      setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), sku: p.sku, image: p.image || "" });
      setModal({ open: true, editId: id });
    } else {
      setForm({ name: "", category: "", price: "", stock: "", sku: "", image: "" });
      setModal({ open: true });
    }
  };

  const save = async () => {
    const { name, category, price, stock, sku, image } = form;
    const errors: string[] = [];
    if (!name) errors.push("Nombre");
    if (!category) errors.push("Categoría");
    if (!price) errors.push("Precio");
    if (!stock) errors.push("Stock");
    if (!sku) errors.push("SKU");
    if (errors.length) return alert("Faltan: " + errors.join(", "));

    const payload = { name, category, price: Number(price), stock: Number(stock), sku, image: image || null };

    if (modal.editId) {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modal.editId, ...payload }),
      });
      if (!res.ok) { const err = await res.json(); return alert(err.error || "Error"); }
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === modal.editId ? updated : p)));
    } else {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const err = await res.json(); return alert(err.error || "Error"); }
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
    }
    setModal({ open: false });
  };

  const remove = async (id: number) => {
    if (orderProductIds.has(id)) return;
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const toggleDisabled = async (id: number) => {
    const res = await fetch(`/api/products/${id}/toggle`, { method: "PATCH" });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  };

  const hasOrders = (id: number) => orderProductIds.has(id);

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
                <input type="text" placeholder="Buscar producto..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); goToPage(1); }} className="bg-transparent outline-none text-sm w-36" />
              </div>
              <button onClick={() => openModal()} className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors">
                + Agregar
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("name")}>Producto{sortIcon("name")}</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("category")}>Categoría{sortIcon("category")}</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("price")}>Precio{sortIcon("price")}</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] cursor-pointer select-none hover:text-[var(--color-fg)]" onClick={() => toggleSort("stock")}>Stock{sortIcon("stock")}</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] w-44">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-surface)]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.image} alt={p.name} size="sm" />
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
                      {hasOrders(p.id) ? (
                        <button onClick={() => toggleDisabled(p.id)} className={`text-sm font-medium ${p.disabled ? "text-green-600 hover:text-green-800" : "text-amber-600 hover:text-amber-800"}`}>
                          {p.disabled ? "Habilitar" : "Deshabilitar"}
                        </button>
                      ) : (
                        <button onClick={() => setDeleteId(p.id)} className="text-sm text-[var(--color-danger)] hover:underline">Eliminar</button>
                      )}
                      {p.disabled && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Deshabilitado</span>}
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Imagen</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !modal.editId) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await fetch(`/api/products/${modal.editId}/image`, { method: "POST", body: fd });
                  if (res.ok) {
                    const { path } = await res.json();
                    setForm({ ...form, image: path });
                  }
                }} className="border border-[var(--color-border-soft)] rounded-md px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-accent)] file:text-[var(--color-accent-on)] file:px-3 file:py-1 file:text-xs file:font-semibold hover:file:bg-[var(--color-accent-hover)]" />
                {form.image && <p className="text-xs text-[var(--color-meta)]">{form.image}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-[var(--color-border-soft)]">
              <button onClick={() => setModal({ open: false })} className="bg-[var(--color-surface-elevated)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-border-soft)]">Cancelar</button>
              <button onClick={save} className="bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-hover)]">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <ConfirmModal
          title="Eliminar producto"
          message={(() => {
            const p = products.find((pr) => pr.id === deleteId);
            return `¿Estás seguro de eliminar "${p?.name || `#${deleteId}`}"? Esta acción no se puede deshacer.`;
          })()}
          confirmLabel="Eliminar"
          variant="danger"
          onConfirm={() => remove(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </>
  );
}

function today() {
  return new Date().toISOString().split("T")[0];
}
