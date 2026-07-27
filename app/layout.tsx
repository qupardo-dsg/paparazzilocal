import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaparazziLocal — Tu tienda de confianza",
  description: "Perfumes, mochilas, peluches, joyería y maquillaje.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
