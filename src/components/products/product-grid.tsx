/**
 * Product Grid - Grid responsivo de productos
 * Con skeleton loading, estado vacío y soporte para vista en lista
 */

import { ProductCard } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';

type ViewMode = 'grid' | 'list';

interface ProductGridProps {
  products:     Product[];
  loading?:     boolean;
  emptyMessage?: string;
  viewMode?:    ViewMode;
}

export function ProductGrid({
  products,
  loading = false,
  emptyMessage = 'No se encontraron productos',
  viewMode = 'grid',
}: ProductGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Intenta con otros filtros o categorías
        </p>
      </div>
    );
  }

  // Vista en lista
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.itemId}
            product={product}
            index={index}
            viewMode="list"
          />
        ))}
      </div>
    );
  }

  // Vista en cuadrícula (default)
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-stretch">
      {products.map((product, index) => (
        <ProductCard key={product.itemId} product={product} index={index} />
      ))}
    </div>
  );
}
