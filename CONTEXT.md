# PaparazziLocal — Domain Context

## Glossary

- **Catálogo** (`Catalog`): Vista de productos filtrada por una categoría. Muestra grid/lista, sort, y filtros laterales.
- **Filtro lateral** (`Sidebar Filter`): Panel colapsable con grupos de filtros (AND). Desktop: visible a la izquierda del grid. Mobile: drawer overlay.
- **Drawer**: Panel que se desliza desde un borde en mobile. Se abre con botón y se cierra con X.
- **Producto** (`Product`): Item del catálogo con nombre, categoría, precio, stock, SKU.
- **Pedido** (`Order`): Compra de un cliente. Cicla estados: Pendiente → En camino → Entregado. Contiene `productIds` para trazabilidad.
- **Pedido activo** (`Active Order`): Pedido en estado `Pendiente` o `En camino`. Bloquea eliminación de sus productos.
- **Admin**: Panel con sidebar oscuro para gestionar productos, pedidos e inventario. Requiere login.
- **Checkout por transferencia**: Flujo de pago sin pasarela. Se muestran datos bancarios y el cliente envía comprobante por WhatsApp.

## Architecture decisions

See `docs/adr/` for formal decisions.
