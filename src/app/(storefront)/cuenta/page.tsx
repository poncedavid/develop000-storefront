'use client';

/**
 * Página de cuenta del usuario
 * Muestra perfil y redirige a login si no está autenticado
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Package, Mail, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAuthStore,
  selectIsAuthenticated,
  selectUserEmail,
  selectUserName,
} from '@/lib/auth/auth-store';
import { useWishlistStore, selectWishlistCount } from '@/lib/store/wishlist-store';

export default function CuentaPage() {
  const router          = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const email           = useAuthStore(selectUserEmail);
  const nombre          = useAuthStore(selectUserName);
  const isChecked       = useAuthStore((s) => s.isChecked);
  const checkSession    = useAuthStore((s) => s.checkSession);
  const logout          = useAuthStore((s) => s.logout);
  const wishlistCount   = useWishlistStore(selectWishlistCount);

  // Verificar sesión al montar
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Redirigir si no está autenticado (después de verificar)
  useEffect(() => {
    if (isChecked && !isAuthenticated) {
      router.push('/login');
    }
  }, [isChecked, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Cargando sesión
  if (!isChecked) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // No autenticado — el useEffect redirige, mostramos nada mientras tanto
  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mi cuenta</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>

      <div className="space-y-4">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-primary" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                {(nombre ?? email ?? '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{nombre ?? 'Sin nombre'}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favoritos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-5 w-5 text-red-500" />
              Mis favoritos
              {wishlistCount > 0 && (
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {wishlistCount} {wishlistCount === 1 ? 'producto' : 'productos'}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {wishlistCount > 0
                ? `Tienes ${wishlistCount} ${wishlistCount === 1 ? 'producto guardado' : 'productos guardados'}.`
                : 'Guarda tus productos favoritos para comprarlos después.'}
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/cuenta/favoritos">
                <Heart className="h-4 w-4 mr-2" />
                Ver mis favoritos
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-5 w-5 text-primary" />
              Mis pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Package className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Aún no tienes pedidos</p>
              <p className="text-sm mt-1">Cuando realices una compra, aparecerá aquí.</p>
              <Button className="mt-4" asChild>
                <Link href="/productos">Ver productos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tu cuenta está protegida con autenticación de dos factores opcional.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
