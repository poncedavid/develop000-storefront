/**
 * Página 404 personalizada
 * Se muestra para cualquier ruta no encontrada en el storefront
 */

import Link       from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        {/* Número 404 grande */}
        <div className="mb-6">
          <span className="text-8xl font-black text-primary/20 select-none leading-none">
            404
          </span>
        </div>

        {/* Ícono */}
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-3">Página no encontrada</h1>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/productos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver productos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
