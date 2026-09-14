'use client';

/**
 * Cart Sheet - Drawer lateral del carrito
 * Se abre desde cualquier parte de la app
 */

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useCartStore,
  selectCartItems,
  selectIsCartOpen,
  selectSubtotal,
} from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils/format';

export function CartSheet() {
  const isOpen = useCartStore(selectIsCartOpen);
  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectSubtotal);
  const closeCart = useCartStore((s) => s.closeCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const isEmpty = items.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito ({items.length})
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          /* Estado vacío */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Tu carrito está vacío</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Agrega productos para comenzar tu compra
              </p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link href="/productos">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.product.itemId} className="flex gap-4">
                    {/* Imagen */}
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                      {item.product.imagenUrl ? (
                        <Image
                          src={item.product.imagenUrl}
                          alt={item.product.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="font-medium line-clamp-1">
                          {item.product.nombre}
                        </h4>
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(item.product.precio)}
                        </p>
                      </div>

                      {/* Cantidad y eliminar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.product.itemId,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.product.itemId,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.itemId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            {/* Footer con totales */}
            <SheetFooter className="flex-col gap-4 sm:flex-col">
              <div className="space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-muted-foreground">
                    Calculado en checkout
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Button asChild size="lg" onClick={closeCart}>
                  <Link href="/checkout">Finalizar compra</Link>
                </Button>
                <Button variant="outline" size="lg" onClick={closeCart}>
                  Seguir comprando
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
