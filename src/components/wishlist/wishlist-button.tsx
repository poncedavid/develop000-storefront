'use client';

/**
 * WishlistButton — Botón de favoritos con Optimistic UI
 *
 * Estados visuales:
 *  - Heart relleno rojo  = liked
 *  - Heart vacío         = not liked
 *  - Spinner             = sincronizando con backend
 *  - Shake + tooltip     = error (rollback ya ocurrió en el store)
 *
 * Accesibilidad:
 *  - aria-label dinámico según estado
 *  - aria-pressed para indicar estado toggle
 */

import { useState, useCallback, useEffect } from 'react';
import { Heart }                from 'lucide-react';
import { toast }                from 'sonner';
import { useWishlistStore }     from '@/lib/store/wishlist-store';
import type { Product }         from '@/types';

interface WishlistButtonProps {
  product:   Product;
  /** Tamaño del botón — 'sm' para cards, 'md' para detalle */
  size?:     'sm' | 'md';
  className?: string;
}

export function WishlistButton({ product, size = 'sm', className = '' }: WishlistButtonProps) {
  const toggle  = useWishlistStore((s) => s.toggle);
  const isLiked = useWishlistStore((s) => s.isLiked(product.itemId));

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  // Evitar hydration mismatch — localStorage solo existe en el cliente.
  // SSR renderiza siempre "no liked"; el cliente hidrata con el valor real.
  useEffect(() => { setMounted(true); }, []);

  // Antes de montar, no mostramos el estado real para evitar mismatch
  const displayLiked = mounted && isLiked;   // muestra feedback de error 1.5s

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();   // evita navegar si está dentro de un Link
      e.stopPropagation();  // evita que la card reciba el click

      if (loading) return;

      setLoading(true);
      setError(false);

      try {
        await toggle(product);
        // Toast de feedback (el estado ya cambió optimísticamente)
        if (!displayLiked) {
          toast.success(`${product.nombre}`, { description: 'Agregado a favoritos', icon: '❤️' });
        } else {
          toast.info(`${product.nombre}`, { description: 'Eliminado de favoritos' });
        }
      } catch {
        // El store ya hizo rollback — solo mostramos feedback visual
        setError(true);
        setTimeout(() => setError(false), 2000);
      } finally {
        setLoading(false);
      }
    },
    [toggle, product, loading]
  );

  const iconSize  = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const btnSize   = size === 'sm' ? 'h-8 w-8'  : 'h-10 w-10';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-label={displayLiked ? `Quitar "${product.nombre}" de favoritos` : `Agregar "${product.nombre}" a favoritos`}
        aria-pressed={displayLiked}
        className={[
          'flex items-center justify-center rounded-full',
          'bg-background border shadow-md',
          'transition-all duration-200',
          btnSize,
          // Estado liked — usa displayLiked para evitar hydration mismatch
          displayLiked
            ? 'border-red-200 text-red-500 hover:bg-red-50'
            : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted',
          // Estado error — shake animation
          error ? 'animate-[shake_0.4s_ease-in-out]' : '',
          // Cursor
          loading ? 'cursor-wait opacity-70' : 'cursor-pointer',
          className,
        ].filter(Boolean).join(' ')}
      >
        {loading ? (
          // Spinner mientras sincroniza
          <span
            className={`${iconSize} animate-spin rounded-full border-2 border-current border-t-transparent`}
            aria-hidden="true"
          />
        ) : (
          <Heart
            className={iconSize}
            fill={displayLiked ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Tooltip de error */}
      {error && (
        <div
          role="alert"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-destructive px-2 py-1 text-xs text-destructive-foreground shadow-md z-50"
        >
          No se pudo guardar
        </div>
      )}
    </div>
  );
}
