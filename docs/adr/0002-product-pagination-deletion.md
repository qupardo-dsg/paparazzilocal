# ADR-0002: Admin product pagination and deletion protection

**Status:** Accepted  
**Date:** 2026-07-27

## Context

Admin product list needs pagination (24 products and growing). Also, deleting a product currently in an active order would break the order.

## Decision

- **Pagination**: URL-based (`?page=2` via `useSearchParams`). Both prev/next buttons and numbered pages. 10 items per page.

- **Delete protection**: Products referenced by orders in `Pendiente` or `En camino` status cannot be deleted. Delete button hidden for those products. Check uses `productIds` array added to each `Order`.

- **Edit allowed**: Products with active orders can still be edited. Manual checkout means don't link to order dynamically. If automated payment is added later, freeze prices in order line items.

## Consequences

- Orders need `productIds: number[]` field for integrity check.
- URL pagination persists across navigation and refresh.
