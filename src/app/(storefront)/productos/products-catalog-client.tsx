'use client';

/**
 * ProductsCatalogClient — wrapper client para el catálogo.
 *
 * Recibe los productos ya filtrados (desde el Server Component)
 * y gestiona el toggle grid/lista de forma local.
 *
 * Separación de responsabilidades:
 *   Server Component → fetch + filtros desde searchParams
 *   Client Component → preferencia de visualización (localStorage)
 */

import { useState } from 'react';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductsToolbar } from './products-toolbar';
import type { Product } from '@/types';
import type { ViewMode } from './products-toolbar';

interface ProductsCatalogClientProps {
  products: Product[];
}

export function ProductsCatalogClient({ products }: ProductsCatalogClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div>
      <ProductsToolbar
        total={products.length}
        onViewModeChange={setViewMode}
      />
      <ProductGrid products={products} viewMode={viewMode} />
    </div>
  );
}
