"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <section className="py-24 max-w-7xl mx-auto px-4 lg:px-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-xl text-[var(--color-muted)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M6 6L5 3H2" />
          </svg>
        </div>
        <p className="text-[var(--color-muted)] mb-6">Tu carrito está vacío</p>
        <Button href="/">Ir a comprar</Button>
      </section>
    );
  }

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 lg:px-16">
      <h1 className="text-[clamp(28px,4vw,48px)] font-[family-name:var(--font-display)] font-light leading-tight mb-4">
        Carrito
      </h1>
      <p className="text-sm text-[var(--color-muted)] mb-8">{items.length} artículo{items.length !== 1 ? "s" : ""} en tu carrito</p>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[80px_1fr_auto] gap-4 items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-lg shadow-sm">
              <div className="aspect-square bg-gradient-to-br from-[var(--color-surface-warm)] to-[var(--color-surface)] rounded-md flex items-center justify-center text-[var(--color-meta)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              </div>
              <div>
                <p className="text-base font-medium">{item.name}</p>
                <p className="text-sm text-[var(--color-muted)]">Cant: {item.quantity}</p>
                <p className="text-lg font-[family-name:var(--font-display)]">${formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[var(--color-border-soft)] rounded-md overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-surface)]">−</button>
                  <input type="text" value={item.quantity} readOnly className="w-11 h-9 text-center bg-transparent outline-none" />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-surface)]">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-sm text-[var(--color-danger)] border border-[var(--color-danger)] rounded-full px-3 py-1 hover:bg-[var(--color-danger)] hover:text-white transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-xl shadow-sm h-fit sticky top-20 flex flex-col gap-5">
          <p className="text-lg font-[family-name:var(--font-display)] font-medium">Resumen</p>
          <div className="flex justify-between text-base">
            <span className="text-[var(--color-muted)]">Subtotal</span>
            <span>${formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-[var(--color-muted)]">Envío</span>
            <span>{total >= 50000 ? "Gratis" : "$5.000"}</span>
          </div>
          <div className="flex justify-between text-2xl font-[family-name:var(--font-display)] font-light pt-4 border-t border-[var(--color-border-soft)]">
            <span className="text-[var(--color-muted)]">Total</span>
            <span>${formatPrice(total)}</span>
          </div>
          <p className="text-sm text-[var(--color-muted)]">Envío gratis en compras superiores a $50.</p>
          <div className="flex flex-col gap-3">
            <Button href="/checkout" className="w-full justify-center">Proceder al checkout</Button>
            <Button href="/" variant="ghost" className="w-full justify-center">Seguir comprando</Button>
          </div>
        </aside>
      </div>
    </section>
  );
}
