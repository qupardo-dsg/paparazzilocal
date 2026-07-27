# ADR-0005: Soft-delete products (disable instead of delete)

**Status:** Accepted  
**Date:** 2026-07-27

## Context

Products referenced in orders cannot be deleted (breaks order history). Instead, disable them — they disappear from the store but remain visible in admin.

## Decision

- Add `disabled Boolean @default(false)` to Product schema.
- Products with orders: "Eliminar" button replaced by "Deshabilitar" toggle.
- Disabled products: hidden from store catalog, visible in admin with "Deshabilitado" badge.
- Can be re-enabled from admin.
- Products with no orders: can still be deleted (the delete button remains).
- API: `PATCH /api/products/:id/toggle` toggles disabled state.

## Consequences

- Schema migration required.
- Store queries filter `disabled: false`.
- Admin shows disabled state with visual badge.
