export function formatPrice(price: number): string {
  return price.toLocaleString("es-CL");
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
