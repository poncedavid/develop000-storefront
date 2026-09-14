/**
 * Página de listado de categorías
 */

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_CATEGORIAS, LISTAR_PRODUCTOS } from '@/lib/graphql/queries';
import { COMPANY_ID, REVALIDATE_CATEGORIES, PAGE_SIZE_CATALOG } from '@/lib/config';
import type { CategoryListResponse, ProductListResponse, Category } from '@/types';

// Next.js requiere literal estático para segment config
export const revalidate = 300; // REVALIDATE_CATEGORIES

export const metadata = {
  title: 'Categorías',
  description: 'Explora todas las categorías de nuestra tienda',
};

async function getCategoriesWithCount(): Promise<
  Array<Category & { productCount: number }>
> {
  try {
    const [catData, prodData] = await Promise.all([
      publicQuery<{ listarCategorias: CategoryListResponse }>(
        LISTAR_CATEGORIAS,
        { companyId: COMPANY_ID, limit: 50 },
        300
      ),
      publicQuery<{ listarProductos: ProductListResponse }>(
        LISTAR_PRODUCTOS,
        { companyId: COMPANY_ID, limit: PAGE_SIZE_CATALOG },
        60
      ),
    ]);

    const products = prodData.listarProductos.items.filter((p) => p.activo);

    return catData.listarCategorias.items
      .filter((c) => c.activo)
      .map((cat) => ({
        ...cat,
        productCount: products.filter((p) => p.categoriaId === cat.itemId).length,
      }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriasPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <p className="text-muted-foreground mt-1">
          {categories.length} categorías disponibles
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <ShoppingBag className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg">No hay categorías disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.itemId}
              href={`/categorias/${category.slug || category.itemId}`}
            >
              <Card className="group overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                {/* Imagen de categoría */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                  {category.imagenUrl ? (
                    <Image
                      src={category.imagenUrl}
                      alt={category.nombre}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 transition-colors">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h2 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                    {category.nombre}
                  </h2>
                  {category.descripcion && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {category.descripcion}
                    </p>
                  )}
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {category.productCount}{' '}
                    {category.productCount === 1 ? 'producto' : 'productos'}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
