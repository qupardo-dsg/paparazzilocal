export const CATEGORIES = ["Perfumes", "Mochilas", "Peluches", "Joyería", "Maquillaje"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  sku: string;
  updated: string;
  description?: string;
};

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "Entregado" | "En camino" | "Pendiente" | "Cancelado";
  date: string;
  productIds: number[];
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export const ORDER_STATUSES = ["Pendiente", "En camino", "Entregado", "Cancelado"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_NEXT: Record<OrderStatus, OrderStatus> = {
  Pendiente: "En camino",
  "En camino": "Entregado",
  Entregado: "Pendiente",
  Cancelado: "Pendiente",
};
