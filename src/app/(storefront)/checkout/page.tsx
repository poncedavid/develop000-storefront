'use client';

/**
 * Página de checkout
 * Resumen del carrito + formulario de envío
 * La pasarela de pago se integrará en una fase posterior
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Truck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  useCartStore,
  selectCartItems,
  selectSubtotal,
} from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils/format';

interface ShippingForm {
  nombre:    string;
  apellido:  string;
  email:     string;
  telefono:  string;
  direccion: string;
  ciudad:    string;
  region:    string;
  comentario: string;
}

const SHIPPING_THRESHOLD = 50000;
const SHIPPING_COST      = 3990;

const REGIONES = [
  'Región Metropolitana',
  'Región de Valparaíso',
  "Región del Libertador Bernardo O'Higgins",
  'Región del Maule',
  'Región del Ñuble',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Ríos',
  'Región de Los Lagos',
  'Región de Aysén',
  'Región de Magallanes',
  'Región de Tarapacá',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región de Arica y Parinacota',
];

export default function CheckoutPage() {
  const items    = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectSubtotal);

  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total        = subtotal + shippingCost;

  const [form, setForm] = useState<ShippingForm>({
    nombre:     '',
    apellido:   '',
    email:      '',
    telefono:   '',
    direccion:  '',
    ciudad:     '',
    region:     '',
    comentario: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid =
    form.nombre && form.apellido && form.email && form.telefono &&
    form.direccion && form.ciudad && form.region;

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">
          Agrega productos antes de continuar con el checkout.
        </p>
        <Button asChild>
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/productos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Seguir comprando
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ══ Formulario de envío ══ */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Datos de envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="nombre" className="text-sm font-medium">
                    Nombre <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Juan"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="apellido" className="text-sm font-medium">
                    Apellido <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="juan@email.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="telefono" className="text-sm font-medium">
                    Teléfono <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+56 9 1234 5678"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="direccion" className="text-sm font-medium">
                  Dirección <span className="text-destructive">*</span>
                </label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Calle Ejemplo 123, Depto 45"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="ciudad" className="text-sm font-medium">
                    Ciudad <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="ciudad"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    placeholder="Santiago"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="region" className="text-sm font-medium">
                    Región <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="region"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Seleccionar región</option>
                    {REGIONES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="comentario" className="text-sm font-medium">
                  Comentarios (opcional)
                </label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={form.comentario}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Instrucciones especiales para el despacho..."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ══ Resumen del pedido ══ */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.itemId} className="flex gap-3">
                    {/* Imagen */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {product.imagenUrl ? (
                        <Image
                          src={product.imagenUrl}
                          alt={product.nombre}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{product.nombre}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(product.precio)}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        ×{quantity}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0">
                      {formatPrice(product.precio * quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totales */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">Gratis</span>
                  ) : (
                    <span>{formatPrice(shippingCost)}</span>
                  )}
                </div>
                {subtotal < SHIPPING_THRESHOLD && (
                  <p className="text-xs text-muted-foreground">
                    Agrega{' '}
                    <span className="font-medium">
                      {formatPrice(SHIPPING_THRESHOLD - subtotal)}
                    </span>{' '}
                    más para envío gratis
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {/* Botón de pago */}
              <Button
                className="w-full"
                size="lg"
                disabled={!isFormValid}
              >
                <Lock className="h-4 w-4 mr-2" />
                Continuar al pago
              </Button>

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Pago 100% seguro y encriptado
              </p>
            </CardContent>
          </Card>

          {/* Link de regreso */}
          <p className="text-xs text-center text-muted-foreground">
            ¿Tienes un código de descuento?{' '}
            <span className="text-primary cursor-pointer hover:underline">
              Aplicar cupón
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
