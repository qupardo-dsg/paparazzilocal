# ADR-0001: Sidebar filters for catalog

**Status:** Accepted  
**Date:** 2026-07-27

## Context

Catalog pages need filter sidebar. Prototype shows collapsible groups (Género, Familia olfativa for Perfumes). Initially, generic placeholder filters. Real filters come later via endpoint.

## Decision

- **AND logic**: multiple filters narrow results cumulatively.
- **Desktop**: sidebar fixed left of product grid. Collapsible groups with chevrons.
- **Mobile**: drawer overlay triggered by "Filtro" button. Has X close button. Full-screen overlay with dark backdrop.
- **State**: resets on category change (normal React remount).
- **Data**: generic placeholders for now (precio, stock). Extensible shape for future endpoint.

## Consequences

- Simple state, no persistence needed.
- Future endpoint will feed dynamic filter definitions per category.
