# develop000-storefront

Tienda pública e-commerce. Next.js 16 + App Router para clientes finales.

## Stack

- **Framework**: Next.js 16 + App Router + TypeScript
- **UI**: shadcn/ui (Radix) + Tailwind CSS v4
- **Estado**: Zustand (carrito, wishlist)
- **API**: AppSync GraphQL via API Key

## Conexión Backend

| Recurso | Valor |
|---------|-------|
| AppSync | `https://dn7fsdqh2bh7rli5ozcrh7hmfi.appsync-api.us-east-1.amazonaws.com/graphql` |
| API Key | `NEXT_PUBLIC_API_KEY` en `.env.local` |
| Company | `develop000` |

## Filosofía — Nivel Producción

### Optimistic UI (OBLIGATORIO para mutaciones)

```typescript
const toggle = async (itemId: string) => {
  // 1. UI responde INMEDIATAMENTE
  wasLiked ? state.delete(itemId) : state.add(itemId);
  persist();
  
  // 2. Backend en background
  if (isAuthenticated) {
    try {
      await backend.toggle(itemId);
    } catch {
      // 3. Rollback si falla
      wasLiked ? state.add(itemId) : state.delete(itemId);
      toast.error('Error.');
    }
  }
};
```

### Single Source of Truth

| Estado | Dónde |
|--------|-------|
| Global persistente | Zustand + persist |
| Servidor | React cache + ISR |
| Local componente | useState |
| URL | searchParams |

## Reglas críticas

### itemId como identificador — NUNCA id

```tsx
// ✅ Correcto
{products.map((p) => <ProductCard key={p.itemId} />)}

// ❌ Incorrecto — causa duplicate keys
{products.map((p) => <ProductCard key={p.id} />)}
```

### lib/config.ts es fuente de verdad

**NUNCA** hardcodear `COMPANY_ID`, revalidate, ni page sizes.

```typescript
// ✅ Correcto
import { COMPANY_ID, REVALIDATE_PRODUCTS } from '@/lib/config';

// ❌ Incorrecto
const COMPANY_ID = 'develop000';
```

### Server vs Client Components

| Tipo | Cuándo |
|------|--------|
| Server (default) | Páginas, fetch, layout |
| `'use client'` | Interactividad, hooks, Zustand |

## Deploy

Amplify Hosting. Rama: `develop`. Producción: `master`.

## Queries públicas (API Key)

- listarProductos, getProductoDetalle
- listarCategorias, getCategoriaDetalle
- listarMarcas, getMarcaDetalle
- listarBanners, getBannerDetalle
- listarArticulos, getArticuloDetalle

> Clientes, pedidos, cupones requieren Cognito.
