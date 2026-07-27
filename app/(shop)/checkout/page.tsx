"use client";

import Button from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, total } = useCart();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-8">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {["Información", "Envío", "Pago"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 text-sm font-medium ${i === 0 ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]"}`}>
                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold ${i === 0 ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-white" : "border-[var(--color-border-soft)]"}`}>
                  {i === 0 ? 1 : i + 1}
                </span>
                {step}
              </div>
              {i < 2 && <div className="w-10 h-px bg-[var(--color-border-soft)]" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-16 pb-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-[clamp(24px,3vw,48px)] font-[family-name:var(--font-display)] font-light leading-tight">
              Datos de envío
            </h2>
            <p className="text-[var(--color-muted)]">Completa tu información para procesar el pedido.</p>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-lg p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" placeholder="Tu nombre" />
                <Field label="Apellido" placeholder="Tu apellido" />
              </div>
              <Field label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" />
              <Field label="Teléfono" type="tel" placeholder="+56 9 1234 5678" />
              <Field label="Dirección" placeholder="Calle, número, departamento" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ciudad" placeholder="Ciudad" />
                <Field label="Código postal" placeholder="0000000" />
              </div>
            </div>

            <h2 className="text-[clamp(24px,3vw,48px)] font-[family-name:var(--font-display)] font-light leading-tight mt-4">
              Método de pago
            </h2>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-lg p-6 flex flex-col gap-5">
              <label className="flex items-start gap-3 p-4 bg-[var(--color-surface-warm)] rounded-lg cursor-pointer border border-[var(--color-border-soft)]">
                <input type="radio" name="payment" defaultChecked className="mt-0.5 accent-[var(--color-accent)]" />
                <div>
                  <p className="font-medium">Transferencia bancaria</p>
                  <p className="text-sm text-[var(--color-muted)] mt-1">Realiza tu pago directamente a nuestra cuenta bancaria</p>
                </div>
              </label>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex flex-col gap-3">
                <p className="text-sm text-amber-800 font-medium mb-1">Datos para transferir</p>
                <Row label="Banco" value="Banco Santander" />
                <Row label="Titular" value="PaparazziLocal S.A." />
                <Row label="Cuenta CLABE" value="014180655039212481" />
                <Row label="Número de cuenta" value="65503921248" />
                <Row label="Referencia" value={`PEDIDO-${Date.now().toString().slice(-6)}`} />
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-amber-800 font-medium">
                  Tu pedido no se procesará hasta que confirmemos la recepción del pago. Envía el comprobante a nuestro <strong>Whatsapp +569 9999 9999</strong>.
                </p>
              </div>
            </div>

            <Button className="w-full justify-center mt-4">Confirmar pedido</Button>
          </div>

          <aside className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-xl shadow-sm h-fit sticky top-20 flex flex-col gap-5">
            <p className="text-lg font-[family-name:var(--font-display)] font-medium">Resumen del pedido</p>
            {items.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No hay productos en tu carrito</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="w-12 h-12 bg-[var(--color-surface-warm)] rounded-md flex items-center justify-center text-[var(--color-meta)] shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${formatPrice(item.price * item.quantity)}</p>
                </div>
              ))
            )}
            <hr className="border-[var(--color-border-soft)]" />
            <div className="flex justify-between"><span className="text-[var(--color-muted)]">Subtotal</span><span>${formatPrice(total)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-muted)]">Envío</span><span>Gratis</span></div>
            <div className="flex justify-between text-2xl font-[family-name:var(--font-display)] font-light pt-4 border-t border-[var(--color-border-soft)]">
              <span className="text-[var(--color-muted)]">Total</span><span>${formatPrice(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-md px-4 py-3 text-base outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_2px_var(--color-accent)] transition-colors"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
