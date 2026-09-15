---
inclusion: always
---

# Proyecto develop000-storefront

## Filosofía de desarrollo — Nivel Producción

Este proyecto sigue estándares de ingeniería de software de nivel universitario avanzado.
Cada decisión técnica debe estar justificada por principios de diseño, no por conveniencia.

### Principios que guían cada implementación

1. **Optimistic UI** — La interfaz responde inmediatamente. Nunca esperes al backend para actualizar la UI. Si el backend falla, revierte con feedback al usuario.

2. **Single Source of Truth** — Cada dato tiene un único origen. No duplicar estado entre componentes, stores ni URL params.

3. **Separation of Concerns** — Server Components fetean datos, Client Components manejan interactividad. Nunca mezclar.

4. **Fail Fast, Recover Gracefully** — Validar en el borde, manejar errores con UI amigable (toast, rollback, retry).

5. **Progressive Enhancement** — Funcionar sin JS cuando sea posible (ISR/SSG). La interactividad es una mejora, no un requisito.

6. **DRY + Composition** — Reutilizar patterns, no copiar código. Un componente hace una cosa bien.

### Patrones de estado obligatorios

```
Estado global persistente  → Zustand + persist (localStorage)
Estado de servidor         → React cache + ISR
Estado local del componente → useState/useReducer
Estado de URL              → searchParams (filtros, paginación)
```

### Patrón Optimistic UI — OBLIGATORIO para mutaciones

```typescript
// ✅ Correcto — UI responde en ~0ms, backend en background
const toggle = async (itemId: string) => {
  // 1. Actualizar estado local PRIMERO (optimistic)
  const wasLiked = state.has(itemId);
  wasLiked ? state.delete(itemId) : state.add(itemId);
  
  // 2. Persistir en localStorage inmediatamente
  persist();
  
  // 3. Si autenticado → sincronizar con backend en background
  if (isAuthenticated) {
    try {
      await backend.toggle(itemId);
    } catch {
      // 4. Rollback si falla
      wasLiked ? state.add(itemId) : state.delete(itemId);
      toast.error('No se pudo guardar. Intenta de nuevo.');
    }
  }
};

// ❌ Incorrecto — esperar al backend antes de actualizar UI
const toggle = async (itemId: string) => {
  await backend.toggle(itemId); // el usuario ve lag
  setState(...);
};
```

### Sincronización anónimo → autenticado

Cuando un usuario anónimo se loguea, sus acciones locales deben sincronizarse:

```typescript
// En auth-store — al completar login exitoso
await Promise.all([
  wishlistStore.syncFromBackend(),  // merge local + remoto
  cartStore.syncFromBackend(),      // sincronizar carrito si aplica
]);
```

---

## Qué es

Storefront público e-commerce. Tienda Next.js para los clientes finales de develop000.

## Stack

- **Framework**: Next.js 16 + App Router + TypeScript
- **UI**: shadcn/ui (Radix) + Tailwind CSS v4
- **Estado**: Zustand (carrito)
- **API**: AppSync GraphQL via API Key pública
- **Deploy**: Pendiente (Amplify Hosting o Vercel)

## Conexión al Backend

| Recurso | Valor |
|---------|-------|
| AppSync URL | `https://dn7fsdqh2bh7rli5ozcrh7hmfi.appsync-api.us-east-1.amazonaws.com/graphql` |
| Auth | API Key (`NEXT_PUBLIC_API_KEY` en `.env.local`) |
| Company ID | `develop000` (en `NEXT_PUBLIC_COMPANY_ID`) |

## CI/CD — Deploy en Amplify Hosting

`amplify.yml` ya existe y está configurado:
- Build: `npm run build`
- Output: `.next` (SSR/ISR — **NO** `output: 'export'`)
- Node: 22.22.3
- Cache: `node_modules/**/*` + `.next/cache/**/*`

**Variables de entorno requeridas en Amplify Console:**
```
NEXT_PUBLIC_GRAPHQL_URL   = https://dn7fsdqh2bh7rli5ozcrh7hmfi.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_API_KEY       = da2-q7hbl5jarvbrraqwyyiuobznym   # vence 2027-09-14
NEXT_PUBLIC_COMPANY_ID    = develop000
NEXT_PUBLIC_SITE_URL      = https://tu-dominio.amplifyapp.com
```

Rama de trabajo: `develop`. Rama de producción: `master`.

---

## Estructura de carpetas

```
src/
├── app/
│   ├── (storefront)/         ← route group para separar de (auth), (checkout)
│   │   ├── layout.tsx        ← Header + Footer + CartSheet
│   │   ├── page.tsx          ← Home
│   │   └── productos/
│   │       ├── page.tsx      ← Catálogo con filtros
│   │       ├── product-filters.tsx (client component)
│   │       └── [slug]/
│   │           ├── page.tsx  ← Detalle SSG+ISR
│   │           └── add-to-cart-button.tsx (client component)
│   └── globals.css
├── components/
│   ├── layout/               ← header.tsx, footer.tsx
│   ├── products/             ← product-card.tsx, product-grid.tsx, skeleton
│   ├── cart/                 ← cart-sheet.tsx
│   └── ui/                   ← shadcn/ui components (NO modificar)
├── lib/
│   ├── config.ts             ← FUENTE ÚNICA de COMPANY_ID, revalidate, page sizes
│   ├── graphql/
│   │   ├── client.ts         ← graphqlRequest(), publicQuery(), privateQuery()
│   │   └── queries.ts        ← todas las queries GraphQL
│   ├── store/
│   │   └── cart-store.ts     ← Zustand store del carrito
│   └── utils/
│       └── format.ts         ← formatPrice(), formatDate(), calculateDiscount()
└── types/
    └── index.ts              ← Product, Category, CartItem, Order, etc.
```

---

## Reglas críticas — evitar code smells

### 1. `itemId` como identificador único — NUNCA usar `id`

El `id` de DynamoDB es el PK (`PRODUCTO#develop000`) — **igual para todos los items de la misma entidad**.
El `itemId` es el UUID único por registro.

```tsx
// ✅ Correcto
{products.map((p) => <ProductCard key={p.itemId} product={p} />)}
{items.map((item) => <div key={item.product.itemId}>...)}

// ❌ Incorrecto — causa "duplicate key" en React
{products.map((p) => <ProductCard key={p.id} product={p} />)}
```

También en el cart-store, las operaciones de `addItem`, `removeItem`, `updateQuantity`
comparan por `product.itemId`, no `product.id`.

### 2. `lib/config.ts` es la fuente única de verdad

**NUNCA** hardcodear `COMPANY_ID`, valores de revalidate ni page sizes en los componentes.

```ts
// ✅ Correcto
import { COMPANY_ID, REVALIDATE_PRODUCTS, PAGE_SIZE_CATALOG } from '@/lib/config';

// ❌ Incorrecto — magic string / magic number
const COMPANY_ID = 'develop000';
export const revalidate = 60;
```

### 3. Fetch deduplication en páginas con múltiples consumers

En la página de detalle, `generateStaticParams`, `generateMetadata` y el componente principal
necesitan los mismos datos. **Una sola función** — Next.js deduplica gracias al cache:

```ts
// ✅ Correcto — Next.js cachea misma URL + variables
async function getAllActiveProducts(): Promise<Product[]> { ... }
// Llamada en generateStaticParams, generateMetadata y el componente → 1 solo fetch real

// ❌ Incorrecto — 3 fetches separados con mismos parámetros
async function getProduct(slug) { /* fetch */ }
async function getRelatedProducts(product) { /* fetch con mismos params */ }
async function generateStaticParams() { /* otro fetch */ }
```

### 4. Server vs Client components

| Tipo | Cuándo usar |
|------|-------------|
| Server Component (default) | Páginas, fetch de datos, layout |
| `'use client'` | Interactividad, eventos, hooks (useState, useEffect, Zustand) |

- `ProductFilters` → `'use client'` (maneja router, searchParams)
- `AddToCartButton` → `'use client'` (usa cart store)
- `Header` → `'use client'` (usa cart store para badge)
- `CartSheet` → `'use client'` (estado open/close)
- Páginas (`page.tsx`) → Server Components siempre

### 5. ISR — revalidación correcta

```ts
// En la página (export named)
export const revalidate = REVALIDATE_PRODUCTS; // viene de lib/config.ts

// En publicQuery (por llamada)
publicQuery(LISTAR_PRODUCTOS, vars, REVALIDATE_PRODUCTS)
```

Tiempos configurados en `lib/config.ts`:
- Productos: 60s
- Categorías: 300s (5 min)
- Banners: 120s

### 6. Metadata y viewport — patrón correcto Next.js 14+

```tsx
// app/layout.tsx — exportar metadata y viewport por separado
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: { default: 'develop000 | Tu tienda online', template: '%s | develop000' },
  description: '...',
  openGraph: { locale: 'es_CL', ... },
};

// viewport separado — requerido para viewport-fit=cover en iOS
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',   // necesario para safe-area en móvil
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0f172a' },
  ],
};
```

**⚠️ Titles en páginas internas:** usar solo el título sin el sufijo, el template lo completa:
```tsx
// ✅ Correcto — el template agrega " | develop000"
export const metadata = { title: 'Productos', description: '...' };

// ❌ Incorrecto — resulta en "Productos | develop000 | develop000"
export const metadata = { title: 'Productos | develop000', description: '...' };
```

### 7. Imágenes — LCP y lazy loading

```tsx
// ProductCard — los primeros 4 productos son above-the-fold (priority para LCP)
// ProductGrid pasa el índice:
{products.map((product, index) => (
  <ProductCard key={product.itemId} product={product} index={index} />
))}

// ProductCard usa el índice:
<Image
  src={product.imagenUrl}
  alt={product.nombre}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  priority={index < 4}           // above-the-fold → LCP
  loading={index < 4 ? undefined : 'lazy'}  // resto → lazy
/>
```

---

## Queries públicas disponibles (API Key)

Solo estas queries aceptan autenticación por API Key — el resto requiere Cognito:

| Query | Uso |
|-------|-----|
| `listarProductos` | Catálogo, home, detalle |
| `getProductoDetalle` | Disponible pero no usamos (usamos listar+filter) |
| `listarCategorias` | Filtros, home |
| `getCategoriaDetalle` | Página de categoría |
| `listarMarcas` | Filtro por marca |
| `getMarcaDetalle` | Página de marca |
| `listarBanners` | Hero, secciones promocionales |
| `getBannerDetalle` | — |
| `listarArticulos` | Blog |
| `getArticuloDetalle` | Detalle de artículo |

Las queries de clientes, pedidos y cupones **requieren Cognito** (datos privados).

---

## Cart store — patrones

```ts
// Agregar al carrito
const addItem = useCartStore((s) => s.addItem);
addItem(product);           // abre el drawer automáticamente

// Selectores optimizados (evitan re-renders innecesarios)
const totalItems = useCartStore(selectTotalItems);
const items      = useCartStore(selectCartItems);
const isOpen     = useCartStore(selectIsCartOpen);
const subtotal   = useCartStore(selectSubtotal);

// Acciones directas
const { openCart, closeCart, removeItem, updateQuantity } = useCartStore((s) => s);
```

El carrito persiste en localStorage con key `develop000-cart`.

---

## UI/UX — convenciones

### Imágenes de productos sin imagen
Mostrar siempre un placeholder con `ShoppingCart` icon centrado sobre fondo `bg-muted`:
```tsx
<div className="flex h-full items-center justify-center bg-muted">
  <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
</div>
```

### Precios
Siempre con `formatPrice()` de `lib/utils/format.ts` — formatea a CLP con separador de miles.

### Badges de stock
- Descuento: `variant="destructive"` → `-XX%`
- Últimas unidades (stock ≤ 5): `bg-orange-100 text-orange-700` → `¡Últimas unidades!`
- Agotado: `variant="secondary"` → `Agotado`

### Navegación de categorías
Siempre usar `slug` si existe, `itemId` como fallback:
```tsx
href={`/categorias/${category.slug || category.itemId}`}
href={`/productos/${product.slug || product.itemId}`}
```

---

## .env.local (no commitear)

```env
NEXT_PUBLIC_GRAPHQL_URL=https://dn7fsdqh2bh7rli5ozcrh7hmfi.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_API_KEY=da2-q7hbl5jarvbrraqwyyiuobznym   # vence 2027-09-14
NEXT_PUBLIC_COMPANY_ID=develop000
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_ZmmEzsSub
NEXT_PUBLIC_COGNITO_CLIENT_ID=2ht4v4gb7iedu9533l2l7rc9bs
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # en prod: URL de Amplify
```

**La API Key vence en 2027-09-14.** Renovar con:
```bash
aws appsync create-api-key \
  --api-id 22sijtvgzncmxbjyzhyd5gobty \
  --description "Storefront público develop000 — dev" \
  --expires $(date -v+365d +%s) \
  --profile develop000 --region us-east-1
```

---

## Wiki de aprendizaje

develop000 tiene su propia wiki separada (NO usar `agent-wiki` que es de Zenda):

```
~/.kiro/develop000-wiki/
├── logs/YYYY/MM/DD.md
└── lessons/
```

---

## Módulo Favoritos (Wishlist) — Arquitectura

### Flujo completo

```
Usuario presiona Heart en ProductCard
  ↓
1. UI responde INMEDIATAMENTE (optimistic update)
   wishlist-store.toggle(product.itemId)
   → Heart relleno/vacío al instante
   → Persiste en localStorage ('develop000-wishlist')
  ↓
2. ¿Está autenticado? (checkea auth-store)
   ├── NO  → queda solo en localStorage
   │          Al hacer login → syncFromBackend() automático
   └── SÍ  → llama al backend en background
              crearFavorito / eliminarFavorito
              Si falla → rollback + toast de error
```

### Store (wishlist-store.ts)

```typescript
interface WishlistState {
  items:    Set<string>;          // Set de itemIds
  synced:   boolean;              // true = sincronizado con backend
  toggle:   (itemId: string, product: Product) => Promise<void>;
  isLiked:  (itemId: string) => boolean;
  syncFromBackend: () => Promise<void>;
  hydrate:  () => void;           // cargar desde localStorage al montar
}
```

### Reglas de negocio

- **Sin sesión**: solo localStorage, no llamar al backend
- **Al login**: `merge(localStorage, backend)` — localStorage tiene prioridad si hay conflicto
- **Al logout**: limpiar `items` en memoria, NO en localStorage (por si vuelve offline)
- **Rollback**: si la llamada al backend falla, revertir el estado local con toast

### Endpoints backend requeridos

| Operación | Auth | Query/Mutation |
|-----------|------|----------------|
| Agregar favorito | Cognito | `mutation crearFavorito` |
| Quitar favorito | Cognito | `mutation eliminarFavorito` |
| Listar favoritos | Cognito | `query listarFavoritos` |

### Componente WishlistButton

```tsx
// Solo visible en desktop (sm:flex) — en mobile no hay hover
// Estado visual: Heart relleno (rojo) = liked, vacío = not liked
// Accesibilidad: aria-label dinámico
<WishlistButton product={product} />
```

### Página /cuenta/favoritos

- Requiere auth — redirige a `/login?returnUrl=/cuenta/favoritos` si no autenticado
- Muestra grid de ProductCards de los productos favoritos
- Si localStorage tiene items no sincronizados → sync automático al cargar
