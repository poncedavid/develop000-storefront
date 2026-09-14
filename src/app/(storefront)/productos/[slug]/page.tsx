/**
 * Página de detalle de producto
 * SSG con ISR para SEO óptimo
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCartButton } from './add-to-cart-button';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_PRODUCTOS } from '@/lib/graphql/queries';
import { formatPrice, calculateDiscount } from '@/lib/utils/format';
import type { ProductListResponse, Product } from '@/types';

const COMPANY_ID = 'develop000';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generar páginas estáticas para los productos existentes
export async function generateStaticParams() {
  try {
    const data = await publicQuery<{ listarProductos: ProductListResponse }>(
      LISTAR_PRODUCTOS,
      { companyId: COMPANY_ID, limit: 100 },
      3600 // Cache por 1 hora para build
    );

    return data.listarProductos.items
      .filter((p) => p.activo)
      .map((product) => ({
        slug: product.slug || product.itemId,
      }));
  } catch {
    return [];
  }
}

// Generar metadata dinámico para SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.nombre} | develop000`,
    description: product.descripcion || `Compra ${product.nombre} al mejor precio`,
    openGraph: {
      title: product.nombre,
      description: product.descripcion,
      images: product.imagenUrl ? [product.imagenUrl] : [],
    },
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const data = await publicQuery<{ listarProductos: ProductListResponse }>(
      LISTAR_PRODUCTOS,
      { companyId: COMPANY_ID, limit: 100 },
      60
    );

    // Buscar por slug o itemId
    const product = data.listarProductos.items.find(
      (p) => p.slug === slug || p.itemId === slug
    );

    return product && product.activo ? product : null;
  } catch {
    return null;
  }
}

async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  try {
    const data = await publicQuery<{ listarProductos: ProductListResponse }>(
      LISTAR_PRODUCTOS,
      { companyId: COMPANY_ID, limit: 20 },
      60
    );

    // Filtrar productos de la misma categoría (excluyendo el actual)
    return data.listarProductos.items
      .filter(
        (p) =>
          p.activo &&
          p.id !== product.id &&
          p.categoriaId === product.categoriaId
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}

const benefits = [
  { icon: Truck, text: 'Envío gratis sobre $50.000' },
  { icon: Shield, text: 'Garantía de satisfacción' },
  { icon: RotateCcw, text: 'Devolución fácil en 30 días' },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);
  const discount = product.precioComparar
    ? calculateDiscount(product.precio, product.precioComparar)
    : 0;

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock =
    product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb / Back link */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/productos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a productos
          </Link>
        </Button>
      </div>

      {/* Producto principal */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {product.imagenUrl ? (
            <Image
              src={product.imagenUrl}
              alt={product.nombre}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-24 w-24 text-muted-foreground/30" />
            </div>
          )}

          {/* Badges sobre la imagen */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <Badge variant="destructive" className="text-sm font-semibold">
                -{discount}% OFF
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                ¡Últimas {product.stock} unidades!
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary">Agotado</Badge>
            )}
          </div>
        </div>

        {/* Info del producto */}
        <div className="flex flex-col">
          {/* SKU */}
          {product.sku && (
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          )}

          {/* Nombre */}
          <h1 className="text-3xl font-bold mt-2">{product.nombre}</h1>

          {/* Precios */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.precio)}
            </span>
            {product.precioComparar &&
              product.precioComparar > product.precio && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.precioComparar)}
                </span>
              )}
          </div>

          {/* Descripción */}
          {product.descripcion && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.descripcion}
              </p>
            </div>
          )}

          <Separator className="my-6" />

          {/* Agregar al carrito */}
          <AddToCartButton product={product} disabled={isOutOfStock} />

          {/* Beneficios */}
          <div className="mt-8 space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-3 text-sm">
                <benefit.icon className="h-5 w-5 text-primary" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/productos/${related.slug || related.itemId}`}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-square bg-muted">
                    {related.imagenUrl ? (
                      <Image
                        src={related.imagenUrl}
                        alt={related.nombre}
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
                    <h3 className="font-medium line-clamp-1 text-sm">
                      {related.nombre}
                    </h3>
                    <p className="text-sm font-bold mt-1">
                      {formatPrice(related.precio)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
