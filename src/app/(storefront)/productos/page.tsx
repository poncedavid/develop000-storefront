/**
 * Página de listado de productos
 * Con filtros, ordenamiento y paginación
 */

import { Suspense } from 'react';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from './product-filters';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_PRODUCTOS, LISTAR_CATEGORIAS } from '@/lib/graphql/queries';
import {
  COMPANY_ID,
  REVALIDATE_PRODUCTS,
  REVALIDATE_CATEGORIES,
  PAGE_SIZE_CATALOG,
} from '@/lib/config';
import type { ProductListResponse, CategoryListResponse, Product, Category } from '@/types';

export const revalidate = REVALIDATE_PRODUCTS;

export const metadata = {
  title: 'Productos',
  description: 'Explora nuestra colección de productos',
};

interface ProductsPageProps {
  searchParams: Promise<{
    categoria?: string;
    orden?: string;
    precio_min?: string;
    precio_max?: string;
    buscar?: string;
  }>;
}

async function getProducts(): Promise<Product[]> {
  try {
    const data = await publicQuery<{ listarProductos: ProductListResponse }>(
      LISTAR_PRODUCTOS,
      { companyId: COMPANY_ID, limit: PAGE_SIZE_CATALOG },
      REVALIDATE_PRODUCTS
    );
    return data.listarProductos.items.filter((p) => p.activo);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const data = await publicQuery<{ listarCategorias: CategoryListResponse }>(
      LISTAR_CATEGORIAS,
      { companyId: COMPANY_ID, limit: 20 },
      REVALIDATE_CATEGORIES
    );
    return data.listarCategorias.items.filter((c) => c.activo);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

function filterAndSortProducts(
  products: Product[],
  filters: {
    categoria?: string;
    orden?: string;
    precio_min?: string;
    precio_max?: string;
    buscar?: string;
  }
): Product[] {
  let filtered = [...products];

  // Filtrar por categoría
  if (filters.categoria) {
    filtered = filtered.filter((p) => p.categoriaId === filters.categoria);
  }

  // Filtrar por precio mínimo
  if (filters.precio_min) {
    const min = parseInt(filters.precio_min, 10);
    filtered = filtered.filter((p) => p.precio >= min);
  }

  // Filtrar por precio máximo
  if (filters.precio_max) {
    const max = parseInt(filters.precio_max, 10);
    filtered = filtered.filter((p) => p.precio <= max);
  }

  // Filtrar por búsqueda
  if (filters.buscar) {
    const search = filters.buscar.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion?.toLowerCase().includes(search) ||
        p.sku?.toLowerCase().includes(search)
    );
  }

  // Ordenar
  switch (filters.orden) {
    case 'precio_asc':
      filtered.sort((a, b) => a.precio - b.precio);
      break;
    case 'precio_desc':
      filtered.sort((a, b) => b.precio - a.precio);
      break;
    case 'nombre_asc':
      filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'nombre_desc':
      filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    case 'nuevo':
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      // Por defecto: más recientes primero
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  return filtered;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = filterAndSortProducts(allProducts, params);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>
        <p className="text-muted-foreground mt-1">
          {products.length} productos encontrados
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar con filtros */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Suspense fallback={<div>Cargando filtros...</div>}>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        {/* Grid de productos */}
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
