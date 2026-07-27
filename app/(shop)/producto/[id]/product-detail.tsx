"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/shop/product-card";
import Button from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-context";
import { useState } from "react";

export default function ProductDetail({ id }: { id: string }) {
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) notFound();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-6">
        <nav className="text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-fg)]">Inicio</Link>
          {" / "}
          <Link href={`/catalogo/${product.category.toLowerCase()}`} className="hover:text-[var(--color-fg)]">
            {product.category}
          </Link>
          {" / "}
          <span className="text-[var(--color-fg)]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-16 pb-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="aspect-square bg-gradient-to-br from-[var(--color-surface-warm)] to-[var(--color-surface)] rounded-xl flex items-center justify-center text-[var(--color-meta)] border border-[var(--color-border-soft)]">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-sm uppercase tracking-widest text-[var(--color-accent)] font-medium">
              {product.category}
            </p>
            <h1 className="text-[clamp(28px,4vw,70px)] font-[family-name:var(--font-display)] font-light leading-tight">
              {product.name}
            </h1>
            <p className="text-5xl font-[family-name:var(--font-display)] font-light">
              ${formatPrice(product.price)}
            </p>
            <p className="text-base text-[var(--color-muted)] max-w-prose">
              {product.description || `Producto de ${product.category.toLowerCase()} de excelente calidad.`}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-sm uppercase tracking-wider text-[var(--color-muted)]">Cantidad</span>
              <div className="flex items-center border border-[var(--color-border-soft)] rounded-md overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[var(--color-surface)]">−</button>
                <input type="text" value={qty} readOnly className="w-12 h-10 text-center bg-transparent outline-none" />
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-[var(--color-surface)]">+</button>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button onClick={() => { for (let i = 0; i < qty; i++) addItem(product.id, product.name, product.price); }}>
                Agregar al carrito
              </Button>
              <Button href="/checkout" variant="ghost">Comprar ahora</Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--color-border-soft)]">
              <div className="text-sm"><strong className="block text-[var(--color-fg)] mb-1">SKU</strong>{product.sku}</div>
              <div className="text-sm"><strong className="block text-[var(--color-fg)] mb-1">Disponibilidad</strong>{product.stock > 0 ? "En stock" : "Agotado"}</div>
              <div className="text-sm"><strong className="block text-[var(--color-fg)] mb-1">Categoría</strong>{product.category}</div>
              <div className="text-sm"><strong className="block text-[var(--color-fg)] mb-1">Envío</strong>Gratis desde $50</div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-[var(--color-border-soft)] py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-16">
            <h2 className="text-[clamp(24px,3vw,48px)] font-[family-name:var(--font-display)] font-light leading-tight mb-8">
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
