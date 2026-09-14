/**
 * Store del carrito de compras
 * Usa Zustand para estado global simple y performante
 * Persiste en localStorage automáticamente
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/types';

// ════════════════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════════════════

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

interface CartComputedValues {
  totalItems: () => number;
  subtotal: () => number;
  total: () => number;
}

type CartStore = CartState & CartActions & CartComputedValues;

// ════════════════════════════════════════════════════════════════
// STORE
// ════════════════════════════════════════════════════════════════

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ── Estado ─────────────────────────────────────────────────
      items: [],
      isOpen: false,

      // ── Acciones ───────────────────────────────────────────────
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Incrementar cantidad si ya existe
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true, // Abrir carrito al agregar
            };
          }

          // Agregar nuevo item
          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ── Valores computados ─────────────────────────────────────
      totalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.product.precio * item.quantity,
          0
        );
      },

      total: () => {
        // Por ahora igual al subtotal, después agregar descuentos/envío
        return get().subtotal();
      },
    }),
    {
      name: 'develop000-cart', // Key en localStorage
      partialize: (state) => ({ items: state.items }), // Solo persistir items
    }
  )
);

// ════════════════════════════════════════════════════════════════
// SELECTORES (para optimizar re-renders)
// ════════════════════════════════════════════════════════════════

export const selectCartItems = (state: CartStore) => state.items;
export const selectIsCartOpen = (state: CartStore) => state.isOpen;
export const selectTotalItems = (state: CartStore) => state.totalItems();
export const selectSubtotal = (state: CartStore) => state.subtotal();
