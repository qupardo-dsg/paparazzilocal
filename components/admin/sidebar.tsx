"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", key: "dashboard", icon: "M3 3h7v7H3V3zm14 0h7v7h-7V3zm-14 14h7v7H3v-7zm14 0h7v7h-7v-7z" },
  { href: "/admin/productos", label: "Productos", key: "productos", icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
  { href: "/admin/pedidos", label: "Pedidos", key: "pedidos", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
  { href: "/admin/inventario", label: "Inventario", key: "inventario", icon: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" },
  { href: "/admin/usuarios", label: "Usuarios", key: "usuarios", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 0 1 4 4M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 bg-[var(--color-sidebar-bg)] text-slate-300 flex flex-col z-40 overflow-y-auto">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <span className="text-lg font-bold text-white">Admin</span>
      </div>
      <nav className="py-3 flex-1">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium border-l-[3px] transition-colors ${
                active
                  ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10 border-l-[var(--color-accent)]"
                  : "text-slate-400 border-l-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={icon} />
              </svg>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-white/10 text-xs text-slate-500">
        <Link href="/" className="text-[var(--color-accent)] hover:underline">
          ← Volver a la tienda
        </Link>
      </div>
    </aside>
  );
}
