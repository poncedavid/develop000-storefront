/**
 * Página de listado de marcas
 */

import Link from 'next/link';
import Image from 'next/image';
import { Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_MARCAS, LISTAR_PRODUCTOS } from '@/lib/graphql/queries';
import { COMPANY_ID, PAGE_SIZE_CATALOG } from '@/lib/config';
import type { BrandListResponse, ProductListResponse, Brand } from '@/types';

export const revalidate = 300;

export const metadata = {
  title: 'Marcas',
  description: 'Explora todas las marcas de nuestra tienda',
};

async function getBrandsWithCount(): Promise<Array<Brand & { productCount: number }>> {
  try {
    const [brandData, prodData] = await Promise.all([
      publicQuery<{ listarMarcas: BrandListResponse }>(
        LISTAR_MARCAS,
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

    return brandData.listarMarcas.items
      .filter((b) => b.activo)
      .map((brand) => ({
        ...brand,
        productCount: products.filter((p) => p.marcaId === brand.itemId).length,
      }));
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function MarcasPage() {
  const brands = await getBrandsWithCount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marcas</h1>
        <p className="text-muted-foreground mt-1">
          {brands.length} marcas disponibles
        </p>
      </div>

      {brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Tag className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg">No hay marcas disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.itemId}
              href={`/marcas/${brand.slug || brand.itemId}`}
            >
              <Card className="group overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.nombre}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 transition-colors">
                      <Tag className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h2 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                    {brand.nombre}
                  </h2>
                  {brand.descripcion && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {brand.descripcion}
                    </p>
                  )}
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {brand.productCount}{' '}
                    {brand.productCount === 1 ? 'producto' : 'productos'}
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
