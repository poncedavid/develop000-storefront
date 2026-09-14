'use client';

/**
 * Product Card - Tarjeta de producto para grids
 * Diseño profesional con hover effects y badges
 */

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart-store';
import { formatPrice, calculateDiscount } from '@/lib/utils/format';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.precioComparar
    ? calculateDiscount(product.precio, product.precioComparar)
    : 0;

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock =
    product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  const productUrl = `/productos/${product.slug || product.itemId}`;

  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <Badge variant="destructive" className="font-semibold">
            -{discount}%
          </Badge>
        )}
        {isLowStock && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            ¡Últimas unidades!
          </Badge>
        )}
        {isOutOfStock && (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            Agotado
          </Badge>
        )}
      </div>

      {/* Acciones rápidas (aparecen en hover) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full shadow-md"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Agregar a favoritos</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full shadow-md"
          asChild
        >
          <Link href={productUrl}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver detalles</span>
          </Link>
        </Button>
      </div>

      {/* Imagen */}
      <Link href={productUrl} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.imagenUrl ? (
            <Image
              src={product.imagenUrl}
              alt={product.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Nombre */}
        <Link href={productUrl}>
          <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
            {product.nombre}
          </h3>
        </Link>

        {/* Precios */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold">
            {formatPrice(product.precio)}
          </span>
          {product.precioComparar && product.precioComparar > product.precio && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.precioComparar)}
            </span>
          )}
        </div>

        {/* SKU (opcional, comentar si no se quiere mostrar) */}
        {product.sku && (
          <p className="mt-1 text-xs text-muted-foreground">SKU: {product.sku}</p>
        )}

        {/* Botón agregar al carrito */}
        <Button
          className="mt-4 w-full"
          disabled={isOutOfStock}
          onClick={() => addItem(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </CardContent>
    </Card>
  );
}
