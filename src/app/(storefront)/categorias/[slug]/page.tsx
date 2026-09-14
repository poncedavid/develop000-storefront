/**
 * Página de detalle de categoría
 * Muestra productos filtrados por categoría
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_CATEGORIAS, LISTAR_PRODUCTOS } from '@/lib/graphql/queries';
import { COMPANY_ID, PAGE_SIZE_CATALOG } from '@/lib/config';
import type { CategoryListResponse, ProductListResponse, Category, Product } from '@/types';

// Next.js requiere literal estático para segment config
export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getAllCategories(): Promise<Category[]> {
  try {
    const data = await publicQuery<{ listarCategorias: CategoryListResponse }>(
      LISTAR_CATEGORIAS,
      { companyId: COMPANY_ID, limit: 50 },
      300
    );
    return data.listarCategorias.items.filter((c) => c.activo);
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
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug || c.itemId }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug || c.itemId === slug);

  if (!category) return { title: 'Categoría no encontrada' };

  return {
    title: category.nombre,
    description:
      category.descripcion || `Productos de la categoría ${category.nombre}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [categories, allProducts] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);

  const category = categories.find((c) => c.slug === slug || c.itemId === slug);
  if (!category) notFound();

  const products = allProducts.filter((p) => p.categoriaId === category.itemId);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/categorias">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Todas las categorías
          </Link>
        </Button>
      </div>

      {/* Header de categoría */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.nombre}</h1>
        {category.descripcion && (
          <p className="text-muted-foreground mt-2">{category.descripcion}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      <ProductGrid
        products={products}
        emptyMessage={`No hay productos en "${category.nombre}" por el momento`}
      />
    </div>
  );
}
