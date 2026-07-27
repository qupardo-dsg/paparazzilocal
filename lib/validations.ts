import { CATEGORIES } from "@/types";

export type ValidationError = { field: string; message: string };

export function validateProduct(data: any, existingSku?: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name?.trim()) errors.push({ field: "name", message: "El nombre es obligatorio" });
  if (!data.category) {
    errors.push({ field: "category", message: "La categoría es obligatoria" });
  } else if (!CATEGORIES.includes(data.category)) {
    errors.push({ field: "category", message: `Categoría no válida. Debe ser: ${CATEGORIES.join(", ")}` });
  }
  if (data.price == null || isNaN(data.price) || Number(data.price) <= 0) {
    errors.push({ field: "price", message: "El precio debe ser mayor a 0" });
  }
  if (data.stock == null || isNaN(data.stock) || Number(data.stock) < 1) {
    errors.push({ field: "stock", message: "El stock debe ser mínimo 1" });
  }
  if (!data.sku?.trim()) {
    errors.push({ field: "sku", message: "El SKU es obligatorio" });
  }

  return errors;
}

export function validateUser(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  const VALID_ROLES = ["admin", "driver", "reponedor"];

  if (!data.name?.trim()) errors.push({ field: "name", message: "El nombre es obligatorio" });
  if (!data.email?.trim()) {
    errors.push({ field: "email", message: "El email es obligatorio" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: "email", message: "El email no es válido" });
  }
  if (!data.password || data.password.length < 8) {
    errors.push({ field: "password", message: "La contraseña debe tener al menos 8 caracteres" });
  }
  if (!data.role) {
    errors.push({ field: "role", message: "El rol es obligatorio" });
  } else if (!VALID_ROLES.includes(data.role)) {
    errors.push({ field: "role", message: `Rol no válido. Debe ser: ${VALID_ROLES.join(", ")}` });
  }

  return errors;
}
