"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { CATEGORIES } from "@/types";
import ProductCard from "@/components/shop/product-card";

export default function CatalogContent({ categoria }: { categoria: string }) {
  const catName = CATEGORIES.find((c) => c.toLowerCase() === categoria);
  if (!catName) notFound();

  const [sort, setSort] = useState("default");
  const [view, setView] = useState<"grid" | "list">("grid");

  let filtered = products.filter((p) => p.category === catName);

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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
        <span className="text-sm text-[var(--color-muted)]">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
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

      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} variant={view} />
        ))}
      </div>
    </section>
  );
}
