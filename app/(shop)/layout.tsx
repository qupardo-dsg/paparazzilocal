import Nav from "@/components/shop/nav";
import Footer from "@/components/shop/footer";
import { CartProvider } from "@/components/shop/cart-context";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Nav />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </CartProvider>
  );
}
