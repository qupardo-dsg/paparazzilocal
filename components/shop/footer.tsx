import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8">
          <div>
            <p className="text-xl font-[family-name:var(--font-display)] font-medium mb-4">PaparazziLocal</p>
            <p className="text-sm text-[var(--color-muted)] max-w-[280px] leading-relaxed">
              Tu tienda online de perfumes, mochilas, peluches, joyería y maquillaje. Calidad y estilo al alcance de un clic.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-fg)] mb-4">Tienda</p>
            <Link href="/" className="block text-sm text-[var(--color-muted)] py-1 hover:text-[var(--color-fg)]">Inicio</Link>
            <Link href="/carrito" className="block text-sm text-[var(--color-muted)] py-1 hover:text-[var(--color-fg)]">Carrito</Link>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-fg)] mb-4">Ayuda</p>
            <span className="block text-sm text-[var(--color-muted)] py-1">Contacto</span>
            <span className="block text-sm text-[var(--color-muted)] py-1">Envíos</span>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-fg)] mb-4">Legal</p>
            <span className="block text-sm text-[var(--color-muted)] py-1">Términos</span>
            <span className="block text-sm text-[var(--color-muted)] py-1">Privacidad</span>
          </div>
        </div>
        <div className="mt-16 pt-6 border-t border-[var(--color-border-soft)] flex flex-col sm:flex-row justify-between items-center text-xs text-[var(--color-meta)] gap-3">
          <span>© 2026 PaparazziLocal. Todos los derechos reservados.</span>
          <span>Hecho con cuidado</span>
        </div>
      </div>
    </footer>
  );
}
