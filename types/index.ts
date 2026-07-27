export const CATEGORIES = ["Perfumes", "Mochilas", "Peluches", "Joyería", "Maquillaje"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  sku: string;
  description?: string;
  image?: string;
  disabled?: boolean;
  updatedAt?: string;
};

export type OrderItem = {
  id: number;
  orderId: string;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
};

export const ORDER_STATUSES = [
  "En espera de confirmación",
  "Pagado",
  "Pendiente de envío",
  "En camino",
  "Entregado",
  "Cancelado",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_NEXT: Record<string, string> = {
  "En espera de confirmación": "Pagado",
  "Pagado": "Pendiente de envío",
  "Pendiente de envío": "En camino",
  "En camino": "Entregado",
  "Entregado": "En espera de confirmación",
  "Cancelado": "En espera de confirmación",
};

export type Order = {
  id: string;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export type StockMovement = {
  id?: number;
  productId: number;
  oldStock: number;
  newStock: number;
  reason: string;
  createdAt?: string;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
