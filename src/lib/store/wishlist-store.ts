'use client';

/**
 * Store de favoritos (Wishlist) — Patrón Optimistic UI
 *
 * Flujo:
 *  1. toggle() actualiza el estado LOCAL inmediatamente (~0ms)
 *  2. Persiste en localStorage automáticamente (Zustand persist)
 *  3. Si está autenticado → sincroniza con backend en background
 *  4. Si el backend falla → rollback del estado local
 *
 * Sincronización al login:
 *  - syncFromBackend() hace merge localStorage + backend
 *  - localStorage tiene prioridad (el usuario los marcó offline)
 */

import { create }    from 'zustand';
import { persist }   from 'zustand/middleware';
import { fetchAuthSession } from 'aws-amplify/auth';
import { COMPANY_ID } from '@/lib/config';
import type { Product, FavoritoListResponse } from '@/types';

// ── Tipos ─────────────────────────────────────────────────────
interface WishlistState {
  // Set de productoIds — O(1) para lookup
  items:   Set<string>;
  // true cuando ya se sincronizó con el backend en esta sesión
  synced:  boolean;

  // Acciones
  toggle:          (product: Product) => Promise<void>;
  isLiked:         (productoId: string) => boolean;
  syncFromBackend: () => Promise<void>;
  clearMemory:     () => void;   // al logout — limpia memoria, no localStorage
}

// ── Helpers de GraphQL privado (Cognito) ─────────────────────
async function graphqlPrivate<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const { tokens } = await fetchAuthSession();
  const token = tokens?.idToken?.toString();
  if (!token) throw new Error('No autenticado');

  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

// Queries inline — evita importar desde queries.ts en un módulo de store
const CREAR_FAVORITO_GQL = `
  mutation CrearFavorito($input: CatalogoInput!) {
    crearFavorito(input: $input) { statusCode message }
  }`;

const ELIMINAR_FAVORITO_GQL = `
  mutation EliminarFavorito($input: CatalogoInput!) {
    eliminarFavorito(input: $input) { statusCode message }
  }`;

const LISTAR_FAVORITOS_GQL = `
  query ListarFavoritos($companyId: String!, $limit: Int) {
    listarFavoritos(companyId: $companyId, limit: $limit) {
      items { productoId }
      total
    }
  }`;

// ── Store ─────────────────────────────────────────────────────
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items:  new Set<string>(),
      synced: false,

      isLiked: (productoId) => get().items.has(productoId),

      toggle: async (product) => {
        const { items } = get();
        const wasLiked = items.has(product.itemId);

        // ── 1. Optimistic update INMEDIATO ──────────────────────
        const newItems = new Set(items);
        wasLiked ? newItems.delete(product.itemId) : newItems.add(product.itemId);
        set({ items: newItems });

        // ── 2. Si autenticado → sincronizar con backend ─────────
        let isAuth = false;
        try {
          const { tokens } = await fetchAuthSession();
          isAuth = !!tokens?.idToken;
        } catch { /* no autenticado */ }

        if (!isAuth) return; // queda solo en localStorage

        try {
          if (wasLiked) {
            await graphqlPrivate(ELIMINAR_FAVORITO_GQL, {
              input: { companyId: COMPANY_ID, productoId: product.itemId },
            });
          } else {
            await graphqlPrivate(CREAR_FAVORITO_GQL, {
              input: {
                companyId:         COMPANY_ID,
                productoId:        product.itemId,
                productoNombre:    product.nombre,
                productoSlug:      product.slug ?? null,
                productoImagenUrl: product.imagenUrl ?? null,
                productoPrecio:    product.precio,
              },
            });
          }
        } catch {
          // ── 3. Rollback si el backend falla ────────────────────
          // Revertir al estado anterior
          const rollback = new Set(get().items);
          wasLiked ? rollback.add(product.itemId) : rollback.delete(product.itemId);
          set({ items: rollback });
          // El componente WishlistButton muestra el toast de error
          throw new Error('Error al sincronizar favorito con el servidor');
        }
      },

      syncFromBackend: async () => {
        // Evitar sincronización doble en la misma sesión
        if (get().synced) return;

        try {
          const data = await graphqlPrivate<{ listarFavoritos: FavoritoListResponse }>(
            LISTAR_FAVORITOS_GQL,
            { companyId: COMPANY_ID, limit: 200 }
          );

          const backendIds = new Set(
            data.listarFavoritos.items.map((f) => f.productoId)
          );

          // Merge: localStorage tiene prioridad
          // → los favoritos locales que no están en backend se mantienen
          // → los del backend se agregan si no están localmente
          const localIds  = get().items;
          const merged    = new Set([...localIds, ...backendIds]);

          set({ items: merged, synced: true });
        } catch {
          // Si falla la sincronización, no es crítico — localStorage sigue funcionando
          set({ synced: true }); // marcar como intentado para no reintentar
        }
      },

      clearMemory: () => {
        // Al logout: limpiar memoria pero NO localStorage
        // (el usuario puede tener favoritos offline que quiere mantener)
        set({ items: new Set<string>(), synced: false });
      },
    }),
    {
      name: 'develop000-wishlist',
      // Serializar Set → Array para localStorage (JSON no soporta Set)
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              items: new Set<string>(parsed.state.items ?? []),
            },
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify({
            ...value,
            state: {
              ...value.state,
              items: Array.from(value.state.items),
            },
          }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

// ── Selectores ────────────────────────────────────────────────
export const selectWishlistCount = (s: WishlistState) => s.items.size;
export const selectWishlistItems = (s: WishlistState) => s.items;
