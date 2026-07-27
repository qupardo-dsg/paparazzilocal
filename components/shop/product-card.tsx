"use client";

import Link from "next/link";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "./cart-context";

export default function ProductCard({ product, variant }: { product: Product; variant?: "grid" | "list" }) {
  const v = variant || "grid";
  const isList = v === "list";
  const { addItem } = useCart();

  return (
    <div
      className={cn(
        "bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-lg overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200",
        isList && "grid grid-cols-[80px_1fr_auto] items-center gap-4 p-4 hover:translate-y-0"
      )}
    >
      <div
        className={cn(
          "bg-gradient-to-br from-[var(--color-surface-warm)] to-[var(--color-surface)] flex items-center justify-center text-[var(--color-meta)]",
          isList ? "w-20 h-20 rounded-md" : "aspect-square"
        )}
      >
        <svg width={isList ? 24 : 48} height={isList ? 24 : 48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      </div>
      <div className={cn(!isList && "p-5")}>
        <p className="text-base font-[family-name:var(--font-display)] font-medium mb-2">{product.name}</p>
        {!isList && <p className="font-[family-name:var(--font-display)] text-lg mb-1">${formatPrice(product.price)}</p>}
        {!isList && <p className="text-sm text-[var(--color-muted)] mb-4">{product.category}</p>}
        {isList && <p className="text-sm text-[var(--color-muted)]">${formatPrice(product.price)}</p>}
        {isList && <p className="text-xs text-[var(--color-muted)]">{product.category}</p>}
        {!isList && (
          <div className="flex flex-col gap-2">
            <Link
              href={`/producto/${product.id}`}
              className="inline-flex items-center justify-center gap-2 text-sm border border-[var(--color-border-soft)] rounded-full px-4 py-2 hover:bg-[var(--color-fg)] hover:text-white hover:border-[var(--color-fg)] transition-all text-center"
            >
              Ver producto
            </Link>
            <button
              onClick={() => addItem(product.id, product.name, product.price)}
              className="inline-flex items-center justify-center gap-2 text-sm bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 hover:bg-[var(--color-accent-hover)] transition-all font-medium"
            >
              Agregar al carrito
            </button>
          </div>
        )}
      </div>
      {isList && (
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/producto/${product.id}`}
            className="text-sm border border-[var(--color-border-soft)] rounded-full px-4 py-2 hover:bg-[var(--color-fg)] hover:text-white hover:border-[var(--color-fg)] transition-all"
          >
            Ver producto
          </Link>
          <button
            onClick={() => addItem(product.id, product.name, product.price)}
            className="text-sm bg-[var(--color-accent)] text-[var(--color-accent-on)] rounded-full px-4 py-2 hover:bg-[var(--color-accent-hover)] transition-all font-medium"
          >
            Agregar al carrito
          </button>
        </div>
      )}
    </div>
  );
}
