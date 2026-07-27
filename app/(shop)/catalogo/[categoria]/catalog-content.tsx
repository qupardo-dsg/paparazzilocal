"use client";

import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { CATEGORIES } from "@/types";
import ProductCard from "@/components/shop/product-card";
import FilterSidebar from "@/components/shop/filter-sidebar";

export default function CatalogContent({ categoria }: { categoria: string }) {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const catName = CATEGORIES.find((c) => norm(c) === norm(categoria));
  if (!catName) notFound();

  const [sort, setSort] = useState("default");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const catProducts = useMemo(() => products.filter((p) => p.category === catName), [catName]);

  const filterGroups = useMemo(() => {
    const priceRanges = [
      { value: "bajo", label: "Bajo ($0 - $15.000)", min: 0, max: 15000 },
      { value: "medio", label: "Medio ($15.000 - $30.000)", min: 15000, max: 30000 },
      { value: "alto", label: "Alto ($30.000+)", min: 30000, max: Infinity },
    ];

    return [
      {
        id: "precio",
        label: "Precio",
        options: priceRanges.map((r) => ({
          value: r.value,
          label: r.label,
          count: catProducts.filter((p) => p.price >= r.min && p.price < r.max).length,
        })),
      },
      {
        id: "stock",
        label: "Stock",
        options: [
          { value: "en-stock", label: "En stock", count: catProducts.filter((p) => p.stock > 5).length },
          { value: "bajo", label: "Stock bajo", count: catProducts.filter((p) => p.stock <= 5).length },
        ],
      },
    ];
  }, [catProducts]);

  const toggleFilter = (groupId: string, value: string) => {
    setFilters((prev) => {
      const current = prev[groupId] || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [groupId]: next };
    });
  };

  let filtered = catProducts;

  // Apply AND filters
  const precioFilter = filters["precio"] || [];
  if (precioFilter.length > 0) {
    const ranges: Record<string, { min: number; max: number }> = {
      bajo: { min: 0, max: 15000 },
      medio: { min: 15000, max: 30000 },
      alto: { min: 30000, max: Infinity },
    };
    filtered = filtered.filter((p) => precioFilter.some((v) => p.price >= ranges[v].min && p.price < ranges[v].max));
  }

  const stockFilter = filters["stock"] || [];
  if (stockFilter.length > 0) {
    filtered = filtered.filter((p) => {
      if (stockFilter.includes("en-stock") && stockFilter.includes("bajo")) return true;
      if (stockFilter.includes("en-stock")) return p.stock > 5;
      if (stockFilter.includes("bajo")) return p.stock <= 5;
      return true;
    });
  }

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "name-asc") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc") filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 lg:px-16">
      <nav className="text-sm text-[var(--color-muted)] mb-6 py-5">
        <Link href="/" className="hover:text-[var(--color-fg)] transition-colors">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-fg)]">{catName}</span>
      </nav>
      <h1 className="text-[clamp(32px,5vw,70px)] font-[family-name:var(--font-display)] font-light leading-tight mb-6">
        {catName}
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-3">
          <FilterSidebar groups={filterGroups} selected={filters} onChange={toggleFilter} />
          <span className="text-sm text-[var(--color-muted)]">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
          <div className="flex gap-px border border-[var(--color-border-soft)] rounded-md overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-[var(--color-fg)] text-white" : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]"}`}
              aria-label="Vista grid"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-[var(--color-fg)] text-white" : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]"}`}
              aria-label="Vista lista"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-60 shrink-0">
          <aside className="sticky top-32 space-y-px border border-[var(--color-border-soft)] rounded-lg p-4 bg-[var(--color-surface)]">
            <p className="text-sm font-semibold mb-3">Filtros</p>
            <FilterGroupList groups={filterGroups} selected={filters} onChange={toggleFilter} />
          </aside>
        </div>

        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-1" : "flex flex-col gap-4 flex-1"}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} variant={view} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterGroupList({
  groups,
  selected,
  onChange,
}: {
  groups: { id: string; label: string; options: { value: string; label: string; count: number }[] }[];
  selected: Record<string, string[]>;
  onChange: (groupId: string, value: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {groups.map((g) => (
        <div key={g.id} className="border-b border-[var(--color-border-soft)] last:border-b-0">
          <button onClick={() => toggle(g.id)} className="w-full flex items-center justify-between py-2.5 text-sm font-semibold hover:text-[var(--color-fg)] transition-colors">
            {g.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform duration-200 ${collapsed[g.id] ? "-rotate-90" : ""}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {!collapsed[g.id] && (
            <div className="pb-2.5 space-y-1.5">
              {g.options.map((opt) => (
                <label key={opt.value} className="flex items-center justify-between text-sm cursor-pointer py-0.5 hover:text-[var(--color-fg)] transition-colors">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(selected[g.id] || []).includes(opt.value)}
                      onChange={() => onChange(g.id, opt.value)}
                      className="accent-[var(--color-accent)]"
                    />
                    {opt.label}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">({opt.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
