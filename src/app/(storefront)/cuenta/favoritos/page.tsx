'use client';

/**
 * Página /cuenta/favoritos
 * Muestra los productos que el usuario marcó como favoritos.
 *
 * Requiere autenticación — redirige a /login si no hay sesión.
 *
 * Flujo:
 *  1. Verifica sesión con checkSession()
 *  2. Si no autenticado → redirect a /login?returnUrl=/cuenta/favoritos
 *  3. Llama syncFromBackend() para asegurar que localStorage + backend estén sincronizados
 *  4. Carga los productos completos de los favoritos
 */

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import { Heart }               from 'lucide-react';
import Link                    from 'next/link';
import { Button }              from '@/components/ui/button';
import { Skeleton }            from '@/components/ui/skeleton';
import { ProductGrid }         from '@/components/products/product-grid';
import {
  useAuthStore,
  selectIsAuthenticated,
} from '@/lib/auth/auth-store';
import {
  useWishlistStore,
  selectWishlistItems,
} from '@/lib/store/wishlist-store';
import { publicQuery }         from '@/lib/graphql/client';
import { LISTAR_PRODUCTOS }    from '@/lib/graphql/queries';
import { COMPANY_ID, PAGE_SIZE_CATALOG } from '@/lib/config';
import type { Product, ProductListResponse } from '@/types';

export default function FavoritosPage() {
  const router          = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isChecked       = useAuthStore((s) => s.isChecked);
  const checkSession    = useAuthStore((s) => s.checkSession);
  const syncFromBackend = useWishlistStore((s) => s.syncFromBackend);
  const wishlistIds     = useWishlistStore(selectWishlistItems);

  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(true);

  // 1. Verificar sesión al montar
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // 2. Redirigir si no autenticado
  useEffect(() => {
    if (isChecked && !isAuthenticated) {
      router.push('/login?returnUrl=/cuenta/favoritos');
    }
  }, [isChecked, isAuthenticated, router]);

  // 3. Sincronizar + cargar productos cuando ya está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      setLoading(true);
      try {
        // Sincronizar backend → localStorage (merge)
        await syncFromBackend();

        // Cargar todos los productos y filtrar los favoritos
        const data = await publicQuery<{ listarProductos: ProductListResponse }>(
          LISTAR_PRODUCTOS,
          { companyId: COMPANY_ID, limit: PAGE_SIZE_CATALOG },
          60
        );
        const allProducts = data.listarProductos.items.filter((p) => p.activo);
        // Filtrar solo los que están en el wishlist
        const favProducts = allProducts.filter((p) => wishlistIds.has(p.itemId));
        setProducts(favProducts);
      } catch (error) {
        console.error('Error cargando favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Esqueleto mientras verifica sesión
  if (!isChecked) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        <div>
          <h1 className="text-3xl font-bold">Mis favoritos</h1>
          {!loading && (
            <p className="text-muted-foreground mt-1">
              {products.length} {products.length === 1 ? 'producto guardado' : 'productos guardados'}
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 items-stretch">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-16 w-16 mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-semibold">Aún no tienes favoritos</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Presiona el corazón en cualquier producto para guardarlo aquí.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/productos">Explorar productos</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
