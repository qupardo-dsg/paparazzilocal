# PaparazziLocal

Tienda online para negocio físico — perfumes, mochilas, peluches, joyería y maquillaje.

## Stack

- **Next.js 16** (App Router + Turbopack)
- **Tailwind CSS v4**
- **TypeScript**
- **Next Auth** (JWT con jose)

## Estructura

```
app/
├── (shop)/                     # Tienda pública
│   ├── page.tsx                # Landing con hero, categorías, destacados
│   ├── catalogo/[categoria]/   # Catálogo dinámico (grid/lista, sort, filtros)
│   ├── producto/[id]/          # Detalle de producto + relacionados
│   ├── carrito/                # Carrito con localStorage
│   └── checkout/               # Checkout con transferencia bancaria
├── admin/                      # Panel de administración
│   ├── login/                  # Auth por contraseña
│   ├── page.tsx                # Dashboard (KPIs, gráfico ventas)
│   ├── productos/              # CRUD productos (modal alta/edición)
│   ├── pedidos/                # Gestión de pedidos (ciclar estados)
│   └── inventario/             # Control de stock con barras de nivel
├── api/                        # Endpoints
│   └── auth/login/             # Login admin (POST)
└── middleware.ts               # Protege rutas /admin/*
```

## Requisitos

- Node.js 24+
- npm

## Instalación

```bash
npm install
cp .env.local.example .env.local  # Configurar ADMIN_PASSWORD
```

## Desarrollo

```bash
npm run dev
```

- Tienda: http://localhost:3000
- Admin: http://localhost:3000/admin (contraseña en `.env.local`)

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `ADMIN_PASSWORD` | Contraseña para acceder al panel admin | `admin123` |
| `ADMIN_SECRET` | Secreto para firmar tokens JWT | (generar aleatorio) |

## Diseño

Prototipo generado con [Open Design](https://github.com/nexu-io/open-design). Design system: PaparazziLocal.
Colores: acento `#ffd30f` (amarillo), fondo blanco, nav oscura.

## Skills

Usa [Matt Pocock Skills](https://github.com/mattpocock/skills) para flujo de desarrollo:

```
/grill-with-docs    → Definir qué construir
/to-spec            → Crear especificación
/to-tickets         → Romper en tickets
/implement          → Construir con TDD
/code-review        → Revisar antes de commit
```

Ver `docs/agents/` para configuración del issue tracker y domain docs.
