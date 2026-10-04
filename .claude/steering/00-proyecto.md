---
inclusion: always
tags: [nextjs, storefront, frontend, ecommerce]
difficulty: beginner
updated: 2026-10-04
---

# Proyecto: Develop000-Storefront

Storefront del e-commerce — tienda pública para clientes finales (Next.js 16).

---

## 🔧 Stack

| Componente | Versión |
|------------|---------|
| **Framework** | Next.js 16 + App Router |
| **Tipado** | TypeScript strict |
| **UI** | shadcn/ui (Radix) + Tailwind CSS v4 |
| **Estado** | Zustand (carrito, wishlist) |
| **API** | GraphQL (connect a AppSync backend) |
| **SEO** | Next.js SSR, SSG, ISR + JSON-LD |

---

## 🛍️ Características

- Listado de productos con filtros
- Carrito persistente (localStorage + Zustand)
- Checkout con validación
- Búsqueda con debounce
- SEO completo (sitemap, robots.txt, OG tags)
- Mobile responsive
- Dark mode (Tailwind)

---

## ⚙️ Convenciones Obligatorias

### TypeScript Strict

```typescript
// ✅ CORRECTO
interface Product {
  id: string;
  nombre: string;
  precio: number;
}

// ❌ INCORRECTO
const product: any = { ... };
```

### Zustand Store

```typescript
// store/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  cantidad: number;
}

export const useCartStore = create<{
  items: CartItem[];
  addItem: (id: string) => void;
}>(
  persist(
    (set) => ({
      items: [],
      addItem: (id) => set(state => ({
        items: [...state.items, { id, cantidad: 1 }]
      })),
    }),
    { name: 'cart' }
  )
);
```

### GraphQL Queries

```typescript
// lib/graphql.ts
export const QUERY_PRODUCTOS = `
  query ListarProductos($limit: Int, $nextToken: String) {
    listarProductos(limit: $limit, nextToken: $nextToken) {
      items {
        id
        nombre
        precio
        imagen
        activo
      }
      nextToken
    }
  }
`;

async function fetchProductos(limit = 25) {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ query: QUERY_PRODUCTOS, variables: { limit } }),
  });
  return response.json();
}
```

### SEO — Metadata

```typescript
// app/productos/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos | Develop000',
  description: 'Compra nuestros productos de calidad',
  openGraph: {
    type: 'website',
    title: 'Productos | Develop000',
    description: 'Compra nuestros productos',
    images: [{ url: 'https://...' }],
  },
};

export default function ProductosPage() {
  return <main>...</main>;
}
```

### SSR vs SSG vs ISR

```typescript
// SSG — genera en build time
export const revalidate = false;

// ISR — regenera cada 60 segundos
export const revalidate = 60;

// SSR — genera en request time
export const revalidate = 0;
```

---

## 🔌 Conexión al Backend

```typescript
// .env.local
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://dn7fsdqh2bh7rli5ozcrh7hmfi.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_COGNITO_DOMAIN=https://develop000.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=2ht4v4gb7iedu9533l2l7rc9bs
NEXT_PUBLIC_REGION=us-east-1
```

---

## 📁 Estructura

```
app/
├── layout.tsx           ← Layout global
├── page.tsx             ← Home
├── productos/
│   ├── page.tsx         ← Lista productos
│   └── [id]/
│       └── page.tsx     ← Detalle producto
├── carrito/
│   └── page.tsx         ← Carrito
└── checkout/
    └── page.tsx         ← Checkout

lib/
├── graphql.ts           ← Queries GraphQL
└── api-client.ts        ← Client de API

store/
└── cart.ts              ← Zustand store
```

---

## ✅ Checklist

- [ ] Leí `.claude/steering/00-proyecto.md`
- [ ] Stack: Next.js 16 + TypeScript + Zustand
- [ ] SEO configurado (metadata, JSON-LD, sitemap)
- [ ] Carrito persistente con Zustand
- [ ] Queries GraphQL tipadas

---

## 📚 Referencias

- [[INDEX]] — Navegación rápida
- `.claude/CLAUDE.md` — Instrucciones locales

