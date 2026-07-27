import Link from "next/link";
import { products } from "@/data/products";
import { CATEGORIES } from "@/types";
import ProductCard from "@/components/shop/product-card";
import Button from "@/components/ui/button";

const icons: Record<string, string> = {
  Perfumes: "M12 2c-4 0-8 3-8 8 0 3 2 6 8 14 6-8 8-11 8-14 0-5-4-8-8-8z",
  Mochilas: "M5 7h14v11H5V7zm4-2h6V3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2z",
  Peluches: "M9 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm6 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM6 12c0 3 3 6 6 6s6-3 6-6",
  Joyería: "M12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  Maquillaje: "M6 4h12v14H6V4zm2 2h8v4H8V6z",
};

export default function LandingPage() {
  const featured = products.slice(0, 4);
  const counts = CATEGORIES.map(
    (cat) => [cat, products.filter((p) => p.category === cat).length] as const
  );

  return (
    <>
      <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] px-4 md:px-16 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--color-surface-elevated),transparent_70%)] opacity-60 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)] mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Tu tienda de confianza
          </p>
          <h1 className="text-[clamp(48px,8vw,96px)] font-[family-name:var(--font-display)] font-light leading-none mb-6">
            PaparazziLocal
          </h1>
          <p className="text-xl text-[var(--color-muted)] max-w-xl mx-auto mb-8 leading-relaxed">
            Descubre perfumes exclusivos, mochilas únicas, peluches adorables, joyería elegante y maquillaje de tendencia. Todo en un solo lugar.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/catalogo/perfumes">Explorar catálogo</Button>
            <Button href="/catalogo/perfumes" variant="ghost">Ver ofertas</Button>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 lg:px-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-4">Categorías</p>
          <h2 className="text-[clamp(28px,4vw,55px)] font-[family-name:var(--font-display)] font-light leading-tight mb-4">
            Explora por departamento
          </h2>
          <p className="text-xl text-[var(--color-muted)]">Cada categoría está curada para ofrecerte lo mejor.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/catalogo/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
              className="flex flex-col items-center text-center gap-4 p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-[var(--color-surface-warm)] rounded-lg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={icons[cat] || "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"} />
                </svg>
              </div>
              <span className="text-lg font-[family-name:var(--font-display)] font-medium">{cat}</span>
              <span className="text-sm text-[var(--color-muted)]">
                {counts.find(([c]) => c === cat)?.[1]} productos
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[var(--color-surface-warm)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-4">Destacados</p>
            <h2 className="text-[clamp(28px,4vw,55px)] font-[family-name:var(--font-display)] font-light leading-tight mb-4">
              Lo más popular
            </h2>
            <p className="text-xl text-[var(--color-muted)]">Productos que nuestros clientes adoran esta semana.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 lg:px-16">
        <div className="bg-[var(--color-surface-warm)] border border-[var(--color-border-soft)] rounded-xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,211,15,0.08),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-4">Envío gratis</p>
            <h2 className="text-[clamp(28px,4vw,48px)] font-[family-name:var(--font-display)] font-light leading-tight mb-4">
              En compras mayores a $50
            </h2>
            <p className="text-xl text-[var(--color-muted)] max-w-lg mx-auto mb-6 leading-relaxed">
              Aprovecha y completa tu look con nuestros productos seleccionados. Entrega rápida a todo el país.
            </p>
            <Button href="/catalogo/perfumes">Comprar ahora</Button>
          </div>
        </div>
      </section>
    </>
  );
}
