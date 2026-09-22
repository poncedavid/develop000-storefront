/**
 * Store del carrito de compras
 * Usa Zustand para estado global simple y performante
 * Persiste en localStorage automáticamente
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
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
            (item) => item.product.itemId === product.itemId
          );

          if (existingItem) {
            // Toast: cantidad actualizada
            toast.success(`${product.nombre}`, {
              description: `Cantidad actualizada a ${existingItem.quantity + quantity}`,
              icon: '🛒',
            });
            return {
              items: state.items.map((item) =>
                item.product.itemId === product.itemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          // Toast: producto agregado
          toast.success(`${product.nombre}`, {
            description: 'Agregado al carrito',
            icon: '🛒',
          });
          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        const item = get().items.find(i => i.product.itemId === productId);
        if (item) {
          toast.info(`${item.product.nombre}`, { description: 'Eliminado del carrito' });
        }
        set((state) => ({
          items: state.items.filter((item) => item.product.itemId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.itemId === productId ? { ...item, quantity } : item
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
