'use client';

/**
 * RecentlyViewedSection — sección "Vistos recientemente" en la página de detalle.
 *
 * Lee del recently-viewed-store y muestra las tarjetas de los últimos productos vistos,
 * excluyendo el producto actual. Se hidrata en el cliente (localStorage).
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useRecentlyViewedStore, type RecentProduct } from '@/lib/store/recently-viewed-store';
import { formatPrice } from '@/lib/utils/format';
import { Card, CardContent } from '@/components/ui/card';

interface RecentlyViewedSectionProps {
  currentItemId: string;
}

export function RecentlyViewedSection({ currentItemId }: RecentlyViewedSectionProps) {
  // Evitar hydration mismatch — localStorage solo existe en el cliente
  const [mounted, setMounted]     = useState(false);
  const [items,   setItems]       = useState<RecentProduct[]>([]);
  const getItemsExcluding         = useRecentlyViewedStore((s) => s.getItemsExcluding);

  useEffect(() => {
    setMounted(true);
    setItems(getItemsExcluding(currentItemId).slice(0, 5));
  }, [currentItemId, getItemsExcluding]);

  // Nada que mostrar hasta hidratar o si no hay historial
  if (!mounted || items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Vistos recientemente</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((product) => (
          <Link
            key={product.itemId}
            href={`/productos/${product.slug || product.itemId}`}
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
              <div className="relative aspect-square bg-muted">
                {product.imagenUrl ? (
                  <Image
                    src={product.imagenUrl}
                    alt={product.nombre}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium line-clamp-1 text-sm">{product.nombre}</h3>
                <p className="text-sm font-bold mt-1 text-primary">
                  {formatPrice(product.precio)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
