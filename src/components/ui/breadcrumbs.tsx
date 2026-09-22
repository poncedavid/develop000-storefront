'use client';

/**
 * Breadcrumbs — navegación de migas de pan.
 *
 * Uso:
 *   <Breadcrumbs items={[
 *     { label: 'Productos', href: '/productos' },
 *     { label: 'Categoría', href: '/categorias/ropa' },
 *     { label: 'Nombre del producto' },   // último sin href = current
 *   ]} />
 *
 * Accesibilidad: usa nav[aria-label="breadcrumb"] con ol semántico.
 * SEO: el último item no tiene href (es la página actual).
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items:     BreadcrumbItem[];
  showHome?: boolean;   // agrega "Inicio" al principio (default: true)
  className?: string;
}

export function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Inicio', href: '/' }, ...items]
    : items;

  return (
    <nav aria-label="Migas de pan" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {/* Separador — no antes del primero */}
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50" aria-hidden />
              )}

              {/* Icono de inicio en el primer item */}
              {index === 0 && showHome && (
                <Home className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
              )}

              {isLast ? (
                // Último item — página actual, no es link
                <span
                  className="font-medium text-foreground max-w-[180px] truncate"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                // Items anteriores — son links
                <Link
                  href={item.href!}
                  className="hover:text-foreground transition-colors hover:underline underline-offset-4 max-w-[150px] truncate"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
