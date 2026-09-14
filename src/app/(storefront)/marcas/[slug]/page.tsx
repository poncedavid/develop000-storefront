/**
 * Página de detalle de marca con sus productos
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_MARCAS, LISTAR_PRODUCTOS } from '@/lib/graphql/queries';
import { COMPANY_ID, PAGE_SIZE_CATALOG } from '@/lib/config';
import type { BrandListResponse, ProductListResponse, Brand, Product } from '@/types';

export const revalidate = 60;

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

async function getAllBrands(): Promise<Brand[]> {
  try {
    const data = await publicQuery<{ listarMarcas: BrandListResponse }>(
      LISTAR_MARCAS,
      { companyId: COMPANY_ID, limit: 50 },
      300
    );
    return data.listarMarcas.items.filter((b) => b.activo);
  } catch {
    return [];
  }
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await publicQuery<{ listarProductos: ProductListResponse }>(
      LISTAR_PRODUCTOS,
      { companyId: COMPANY_ID, limit: PAGE_SIZE_CATALOG },
      60
    );
    return data.listarProductos.items.filter((p) => p.activo);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((b) => ({ slug: b.slug || b.itemId }));
}

export async function generateMetadata({ params }: BrandPageProps) {
  const { slug } = await params;
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.slug === slug || b.itemId === slug);

  if (!brand) return { title: 'Marca no encontrada' };

  return {
    title: brand.nombre,
    description: brand.descripcion || `Productos de la marca ${brand.nombre}`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;

  const [brands, allProducts] = await Promise.all([
    getAllBrands(),
    getAllProducts(),
  ]);

  const brand = brands.find((b) => b.slug === slug || b.itemId === slug);
  if (!brand) notFound();

  const products = allProducts.filter((p) => p.marcaId === brand.itemId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/marcas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Todas las marcas
          </Link>
        </Button>
      </div>

      {/* Header de marca */}
      <div className="flex items-center gap-6 mb-8">
        {brand.logoUrl ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted flex-shrink-0">
            <Image
              src={brand.logoUrl}
              alt={brand.nombre}
              fill
              sizes="80px"
              className="object-contain p-2"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted flex-shrink-0">
            <Tag className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{brand.nombre}</h1>
          {brand.descripcion && (
            <p className="text-muted-foreground mt-1">{brand.descripcion}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

      <ProductGrid
        products={products}
        emptyMessage={`No hay productos de "${brand.nombre}" por el momento`}
      />
    </div>
  );
}
