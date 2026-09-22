'use client';

/**
 * Product Card - Tarjeta de producto para grids
 * Diseño profesional con hover effects y badges
 */

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart-store';
import { WishlistButton } from '@/components/wishlist/wishlist-button';
import { formatPrice, calculateDiscount } from '@/lib/utils/format';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  /** Índice en el grid — los primeros 4 tienen priority para LCP */
  index?: number;
  /** Modo de visualización: cuadrícula (default) o lista */
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, index = 99, viewMode = 'grid' }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.precioComparar
    ? calculateDiscount(product.precio, product.precioComparar)
    : 0;

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock =
    product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  const productUrl = `/productos/${product.slug || product.itemId}`;

  // ─── Vista en lista ──────────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <Card className="flex flex-row overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        {/* Imagen cuadrada pequeña */}
        <Link href={productUrl} className="flex-shrink-0">
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 bg-muted">
            {product.imagenUrl ? (
              <Image
                src={product.imagenUrl}
                alt={product.nombre}
                fill
                sizes="128px"
                className="object-cover"
                priority={index < 4}
                loading={index < 4 ? undefined : 'lazy'}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
          </div>
        </Link>

        {/* Contenido */}
        <CardContent className="flex flex-1 items-center gap-4 p-3 sm:p-4">
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-1">
              {discount > 0 && (
                <Badge variant="destructive" className="text-xs">-{discount}%</Badge>
              )}
              {isLowStock && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">¡Últimas!</Badge>
              )}
              {isOutOfStock && (
                <Badge variant="secondary" className="text-xs">Agotado</Badge>
              )}
            </div>

            <Link href={productUrl}>
              <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">
                {product.nombre}
              </h3>
            </Link>

            {product.descripcion && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 hidden sm:block">
                {product.descripcion}
              </p>
            )}

            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold text-primary">{formatPrice(product.precio)}</span>
              {product.precioComparar && product.precioComparar > product.precio && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.precioComparar)}
                </span>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
            <WishlistButton product={product} size="sm" />
            <Button
              size="sm"
              disabled={isOutOfStock}
              onClick={() => addItem(product)}
              className="whitespace-nowrap"
            >
              <ShoppingCart className="hidden sm:inline mr-2 h-4 w-4" />
              {isOutOfStock ? 'Sin stock' : 'Agregar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Vista en cuadrícula (default) ───────────────────────────────────────
  return (
    // flex flex-col h-full → todas las cards crecen igual en el grid
    <Card className="group relative flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <Badge variant="destructive" className="font-semibold text-xs">
            -{discount}%
          </Badge>
        )}
        {isLowStock && (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">
            ¡Últimas unidades!
          </Badge>
        )}
        {isOutOfStock && (
          <Badge variant="secondary" className="text-xs">
            Agotado
          </Badge>
        )}
      </div>

      {/* Acciones rápidas — solo en desktop (hover no existe en touch) */}
      <div className="absolute top-3 right-3 z-10 hidden sm:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <WishlistButton product={product} size="sm" />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background shadow-md border"
          asChild
        >
          <Link href={productUrl} aria-label="Ver detalles">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Imagen — no participa en flex column */}
      <Link href={productUrl} className="block flex-shrink-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.imagenUrl ? (
            <Image
              src={product.imagenUrl}
              alt={product.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={index < 4}
              loading={index < 4 ? undefined : 'lazy'}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </Link>

      {/* Content — flex-1 para que ocupe el espacio restante */}
      <CardContent className="flex flex-1 flex-col p-4 gap-2">
        {/* Nombre — line-clamp-2 garantiza mismo alto siempre */}
        <Link href={productUrl} className="flex-shrink-0">
          <h3 className="font-medium line-clamp-2 leading-snug hover:text-primary transition-colors text-sm min-h-[2.5rem]">
            {product.nombre}
          </h3>
        </Link>

        {/* Precios + WishlistButton en mobile */}
        <div className="flex items-baseline gap-2 flex-shrink-0">
          <span className="text-base font-bold flex-1">
            {formatPrice(product.precio)}
          </span>
          {product.precioComparar && product.precioComparar > product.precio && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.precioComparar)}
            </span>
          )}
          {/* Favorito visible siempre en mobile, oculto en sm+ (donde está en hover) */}
          <div className="sm:hidden flex-shrink-0">
            <WishlistButton product={product} size="sm" />
          </div>
        </div>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-muted-foreground flex-shrink-0">
            SKU: {product.sku}
          </p>
        )}

        {/* Botón — mt-auto lo empuja SIEMPRE al fondo
            Mobile: sin ícono para que el texto no se corte
            Desktop: con ícono */}
        <Button
          className="mt-auto w-full"
          disabled={isOutOfStock}
          onClick={() => addItem(product)}
        >
          <ShoppingCart className="hidden sm:inline mr-2 h-4 w-4" />
          {isOutOfStock ? 'Sin stock' : (
            <>
              <span className="sm:hidden">Al carrito</span>
              <span className="hidden sm:inline">Agregar al carrito</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
