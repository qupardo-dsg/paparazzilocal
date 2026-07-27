"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/types";
import { useCart } from "./cart-context";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { count } = useCart();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowDropdown(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const matches = query ? [] : [];

  const currentCat = CATEGORIES.find((c) => pathname.startsWith(`/catalogo/${c.toLowerCase()}`));

  return (
    <nav className="sticky top-0 z-50 bg-[#000000] border-b border-[#1e2c31] pt-2">
      {/* Top row: logo · search · cart */}
      <div className="h-26 flex items-center">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 lg:px-16 gap-2">
          <Link href="/" className="flex items-center gap-3 shrink-0 text-white text-2xl font-[family-name:var(--font-display)] font-medium tracking-wide">
            <img src="/logo.png" alt="PaparazziLocal" className="h-10 w-auto" />
            PAPARAZZILOCAL
          </Link>

          <div ref={ref} className="hidden lg:block flex-1 max-w-[400px] relative">
            <div className="relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-meta)] pointer-events-none">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => query && setShowDropdown(true)}
                placeholder="Buscar productos..."
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-md pl-10 pr-4 py-2.5 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-accent)] transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (matches as any[]).length > 0) {
                    router.push(`/producto/${(matches as any[])[0].id}`);
                    setShowDropdown(false);
                    setQuery("");
                  }
                }}
              />
            </div>
            {showDropdown && query && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-[var(--color-border-soft)] rounded-md shadow-md z-50 max-h-80 overflow-y-auto">
                {matches.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-[var(--color-muted)] text-center">Sin resultados</p>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/carrito" className="text-white/80 hover:text-white transition-colors relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M6 6L5 3H2" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-accent)] text-[var(--color-accent-on)] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button className="lg:hidden text-white" onClick={() => setOpen(!open)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: categories */}
      <div className="hidden lg:block border-t border-white/[0.06] bg-[var(--color-accent)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-16 flex items-center gap-5 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const active = cat === currentCat;
            return (
              <Link
                key={cat}
                href={`/catalogo/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                className={`relative text-[15px] font-[family-name:var(--font-display)] font-medium whitespace-nowrap px-1 py-[14px] transition-colors duration-150 ${
                  active
                    ? "text-[var(--color-accent-on)] after:content-[''] after:absolute after:bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-[var(--color-accent-on)]"
                    : "text-[var(--color-accent-on)]/70 hover:text-[var(--color-accent-on)]"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 bg-[#000000] z-50 flex flex-col p-6 gap-5 lg:hidden">
          <div className="flex justify-between items-center">
            <span className="text-white text-xl font-medium">PaparazziLocal</span>
            <button className="text-white" onClick={() => setOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <Link href="/" onClick={() => setOpen(false)} className="text-white text-2xl py-3 border-b border-white/10">Inicio</Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/catalogo/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} onClick={() => setOpen(false)} className="text-white text-2xl py-3 border-b border-white/10">
              {cat}
            </Link>
          ))}
          <Link href="/carrito" onClick={() => setOpen(false)} className="text-white text-2xl py-3 border-b border-white/10">Carrito</Link>
        </div>
      )}
    </nav>
  );
}
