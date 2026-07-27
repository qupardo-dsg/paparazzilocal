# ADR-0003: Inventory with stock history and adjust modal

**Status:** Accepted  
**Date:** 2026-07-27

## Context

Inventory needs stock movement tracking (history), search/filter, and a proper adjust modal with reason tracking.

## Decision

- **Stock history**: Array of `{ date, productId, oldStock, newStock, change, reason }`. Paginated (5 most recent). Persisted in memory; future: database.
- **Adjust modal**: Overlay with current stock (readonly), change amount (±), auto-calculated new stock, and reason textarea. Validates new stock ≥ 0.
- **Search**: Input + category filter, same pattern as products page.
- **History shows**: Fecha, Producto (name), Anterior, Nuevo, Cambio (+/-), Motivo.

## Consequences

- History enables audit trail for stock changes.
- Modal replaces raw `prompt()`, better UX and captures reason.
