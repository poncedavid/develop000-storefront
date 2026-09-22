'use client';

/**
 * ProductsToolbar — barra de herramientas del catálogo.
 *
 * Contiene el toggle grid/lista con preferencia persistida en localStorage.
 * Se separa en client component para no contaminar la página (Server Component).
 *
 * El layout del grid se pasa al ProductGrid vía prop `viewMode`.
 */

import { useEffect, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ViewMode = 'grid' | 'list';

const STORAGE_KEY = 'develop000-products-view-mode';

interface ProductsToolbarProps {
  total:    number;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProductsToolbar({ total, onViewModeChange }: ProductsToolbarProps) {
  // Default: grid. Se lee de localStorage en el efecto para evitar hydration mismatch.
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (saved === 'list' || saved === 'grid') {
      setViewMode(saved);
      onViewModeChange(saved);
    }
  // Solo al montar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    onViewModeChange(mode);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-muted-foreground">
        {total} {total === 1 ? 'producto' : 'productos'} encontrados
      </p>

      {/* Toggle grid / lista */}
      {mounted && (
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => toggle('grid')}
            aria-label="Vista en cuadrícula"
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => toggle('list')}
            aria-label="Vista en lista"
            aria-pressed={viewMode === 'list'}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
