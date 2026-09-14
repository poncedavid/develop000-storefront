'use client';

/**
 * Filtros de productos
 * Desktop: sidebar fijo
 * Mobile/Tablet: panel colapsable con botón toggle
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
}

const sortOptions = [
  { value: 'nuevo',        label: 'Más recientes' },
  { value: 'precio_asc',   label: 'Precio: menor a mayor' },
  { value: 'precio_desc',  label: 'Precio: mayor a menor' },
  { value: 'nombre_asc',   label: 'Nombre: A-Z' },
  { value: 'nombre_desc',  label: 'Nombre: Z-A' },
];

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  // Colapsado en mobile por defecto — abierto en desktop (via CSS)
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentCategoria  = searchParams.get('categoria');
  const currentOrden      = searchParams.get('orden');
  const currentPrecioMin  = searchParams.get('precio_min') || '';
  const currentPrecioMax  = searchParams.get('precio_max') || '';
  const currentBuscar     = searchParams.get('buscar') || '';

  // Contar filtros activos para el badge
  const activeCount = [currentCategoria, currentOrden, currentPrecioMin, currentPrecioMax, currentBuscar]
    .filter(Boolean).length;

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

  const clearFilters = () => {
    setMobileOpen(false);
    router.push(pathname);
  };

  const filterContent = (
    <div className="space-y-5">
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
                updateParams('orden', currentOrden === option.value ? null : option.value)
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
                !currentCategoria ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.itemId}
                onClick={() =>
                  updateParams(
                    'categoria',
                    currentCategoria === category.itemId ? null : category.itemId
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
          />
          <Input
            type="number"
            placeholder="Máx"
            value={currentPrecioMax}
            onChange={(e) => updateParams('precio_max', e.target.value || null)}
          />
        </div>
      </div>

      {/* Limpiar filtros */}
      {activeCount > 0 && (
        <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
          <X className="h-3 w-3 mr-1" />
          Limpiar {activeCount} {activeCount === 1 ? 'filtro' : 'filtros'}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* ── MOBILE / TABLET: botón toggle + panel colapsable ── */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs h-5 px-1.5">
                {activeCount}
              </Badge>
            )}
          </span>
          {mobileOpen
            ? <ChevronUp className="h-4 w-4" />
            : <ChevronDown className="h-4 w-4" />
          }
        </Button>

        {mobileOpen && (
          <Card className="mt-2">
            <CardContent className="pt-4">
              {filterContent}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── DESKTOP: sidebar fijo siempre visible ── */}
      <Card className="hidden lg:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filterContent}
        </CardContent>
      </Card>
    </>
  );
}
