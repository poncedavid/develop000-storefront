'use client';

/**
 * RecentlyViewedTracker — registra el producto actual en el historial.
 *
 * Componente invisible (no renderiza nada) que solo ejecuta el efecto
 * de agregar el producto al recently-viewed store cuando se monta.
 *
 * Se usa en la página de detalle:
 *   <RecentlyViewedTracker product={product} />
 */

import { useEffect } from 'react';
import { useRecentlyViewedStore } from '@/lib/store/recently-viewed-store';
import type { Product } from '@/types';

interface RecentlyViewedTrackerProps {
  product: Product;
}

export function RecentlyViewedTracker({ product }: RecentlyViewedTrackerProps) {
  const addProduct = useRecentlyViewedStore((s) => s.addProduct);

  useEffect(() => {
    addProduct({
      itemId:    product.itemId,
      nombre:    product.nombre,
      precio:    product.precio,
      imagenUrl: product.imagenUrl,
      slug:      product.slug,
    });
  // Solo al montar — no repetir si el producto cambia durante la misma sesión
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.itemId]);

  return null;
}
