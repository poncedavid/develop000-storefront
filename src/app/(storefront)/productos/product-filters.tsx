'use client';

/**
 * Filtros de productos
 * Sidebar con categorías, precio y ordenamiento
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
}

const sortOptions = [
  { value: 'nuevo', label: 'Más recientes' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'nombre_asc', label: 'Nombre: A-Z' },
  { value: 'nombre_desc', label: 'Nombre: Z-A' },
];

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoria = searchParams.get('categoria');
  const currentOrden = searchParams.get('orden');
  const currentPrecioMin = searchParams.get('precio_min') || '';
  const currentPrecioMax = searchParams.get('precio_max') || '';
  const currentBuscar = searchParams.get('buscar') || '';

  // Helper para actualizar query params
  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Limpiar todos los filtros
  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    currentCategoria || currentOrden || currentPrecioMin || currentPrecioMax || currentBuscar;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={clearFilters}
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Búsqueda */}
        <div>
          <h4 className="font-medium text-sm mb-2">Buscar</h4>
          <Input
            type="search"
            placeholder="Nombre o SKU..."
            value={currentBuscar}
            onChange={(e) => updateParams('buscar', e.target.value || null)}
          />
        </div>

        <Separator />

        {/* Ordenar */}
        <div>
          <h4 className="font-medium text-sm mb-2">Ordenar por</h4>
          <div className="space-y-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  updateParams(
                    'orden',
                    currentOrden === option.value ? null : option.value
                  )
                }
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  currentOrden === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Categorías */}
        {categories.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Categorías</h4>
            <div className="space-y-1">
              <button
                onClick={() => updateParams('categoria', null)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  !currentCategoria
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    updateParams(
                      'categoria',
                      currentCategoria === category.itemId
                        ? null
                        : category.itemId
                    )
                  }
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    currentCategoria === category.itemId
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {category.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Rango de precio */}
        <div>
          <h4 className="font-medium text-sm mb-2">Precio</h4>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={currentPrecioMin}
              onChange={(e) => updateParams('precio_min', e.target.value || null)}
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Máx"
              value={currentPrecioMax}
              onChange={(e) => updateParams('precio_max', e.target.value || null)}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
