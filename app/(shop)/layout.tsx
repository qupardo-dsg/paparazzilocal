import Nav from "@/components/shop/nav";
import Footer from "@/components/shop/footer";
import { CartProvider } from "@/components/shop/cart-context";
import AnnouncementBar from "@/components/shop/announcement-bar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Nav />
      </div>
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </CartProvider>
  );
}
