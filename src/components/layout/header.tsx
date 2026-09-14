'use client';

/**
 * Header del storefront
 * Incluye logo, navegación, búsqueda y carrito
 */

import Link from 'next/link';
import { Search, ShoppingCart, Menu, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCartStore, selectTotalItems } from '@/lib/store/cart-store';
import { CartSheet } from '@/components/cart/cart-sheet';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Productos', href: '/productos' },
  { name: 'Categorías', href: '/categorias' },
  { name: 'Ofertas', href: '/productos?ofertas=true' },
];

export function Header() {
  const totalItems = useCartStore(selectTotalItems);
  const openCart = useCartStore((s) => s.openCart);

  // Evitar hydration mismatch — el carrito viene de localStorage (solo cliente).
  // El servidor renderiza 0; el cliente hidrata con el valor real.
  // Sin este state, React lanza "Hydration failed" porque SSR ≠ cliente.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const displayItems = mounted ? totalItems : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              D
            </div>
            <span className="hidden font-semibold sm:inline-block">
              develop000
            </span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Búsqueda */}
          <div className="hidden flex-1 max-w-md lg:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full pl-10"
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Búsqueda móvil */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* Usuario */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cuenta">
                <User className="h-5 w-5" />
                <span className="sr-only">Mi cuenta</span>
              </Link>
            </Button>

            {/* Carrito */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              aria-label={`Carrito${displayItems > 0 ? `, ${displayItems} productos` : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {displayItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {displayItems > 99 ? '99+' : displayItems}
                </Badge>
              )}
              <span className="sr-only">Carrito</span>
            </Button>

            {/* Menú móvil */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Cart Sheet (drawer lateral) */}
      <CartSheet />
    </header>
  );
}
