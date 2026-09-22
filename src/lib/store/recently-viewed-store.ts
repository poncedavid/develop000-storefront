/**
 * Recently Viewed Store — historial de productos vistos recientemente.
 *
 * Persiste en localStorage con key 'develop000-recently-viewed'.
 * Guarda los últimos MAX_ITEMS productos, sin duplicados (LIFO — el más reciente primero).
 * Solo guarda los datos mínimos para renderizar la tarjeta.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MAX_ITEMS = 8;

export interface RecentProduct {
  itemId:    string;
  nombre:    string;
  precio:    number;
  imagenUrl?: string;
  slug?:      string;
}

interface RecentlyViewedState {
  items: RecentProduct[];

  /** Agrega un producto al historial (o lo mueve al inicio si ya existía). */
  addProduct: (product: RecentProduct) => void;

  /** Limpia el historial completo. */
  clear: () => void;

  /** Retorna los ítems sin incluir el itemId indicado (para excluir el producto actual). */
  getItemsExcluding: (itemId: string) => RecentProduct[];
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct(product) {
        set((state) => {
          // Eliminar si ya existe (para moverlo al inicio)
          const filtered = state.items.filter((i) => i.itemId !== product.itemId);
          // Agregar al inicio, limitar a MAX_ITEMS
          return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
        });
      },

      clear() {
        set({ items: [] });
      },

      getItemsExcluding(itemId) {
        return get().items.filter((i) => i.itemId !== itemId);
      },
    }),
    {
      name: 'develop000-recently-viewed',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
