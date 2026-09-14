/**
 * Product Card Skeleton - Loading state
 */

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      {/* Imagen skeleton */}
      <Skeleton className="aspect-square w-full" />

      <CardContent className="p-4">
        {/* Nombre */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4 mt-1" />

        {/* Precio */}
        <Skeleton className="h-6 w-24 mt-2" />

        {/* Botón */}
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  );
}
