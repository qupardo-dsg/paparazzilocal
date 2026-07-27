# ADR-0004: Orders filtering, sorting, and unified pagination

**Status:** Accepted  
**Date:** 2026-07-27

## Context

Orders page needs search, sorting, filtering, and pagination. Products pagination should match inventory style.

## Decision

- **Pagination**: Unified style across admin — « ‹ N–M de T › » (matches inventory and Open Design prototype).
- **Search**: Single input matches any field (ID, customer name, status) — AND with other filters.
- **Column filters**: Filter row below header with per-column controls (text for ID/customer, dropdown for status).
- **Sorting**: Click column header toggles ASC/DESC/none. Arrow indicator shows direction.
- **AND logic**: Search + column filters combine with AND.

## Consequences

- Products page needs pagination style update (was using numbered pages).
- Consistent pagination UX across admin.
