'use client';

/**
 * Página de checkout
 * Resumen del carrito + formulario de envío + cupón + crear pedido
 */

import { useState, useTransition } from 'react';
import { useRouter }               from 'next/navigation';
import Link                        from 'next/link';
import Image                       from 'next/image';
import { ArrowLeft, ShoppingCart, Truck, Lock, Tag, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button }                  from '@/components/ui/button';
import { Input }                   from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator }               from '@/components/ui/separator';
import { Badge }                   from '@/components/ui/badge';
import {
  useCartStore,
  selectCartItems,
  selectSubtotal,
} from '@/lib/store/cart-store';
import { privateQuery, publicQuery } from '@/lib/graphql/client';
import { VALIDAR_CUPON, CREAR_PEDIDO } from '@/lib/graphql/queries';
import { COMPANY_ID }              from '@/lib/config';
import { formatPrice }             from '@/lib/utils/format';
import { fetchAuthSession }        from 'aws-amplify/auth';
import { useAuthStore, selectUserEmail, selectUserName } from '@/lib/auth/auth-store';
import type { CuponValidado }      from '@/types';

interface ShippingForm {
  nombre:     string;
  apellido:   string;
  email:      string;
  telefono:   string;
  direccion:  string;
  ciudad:     string;
  region:     string;
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
  const router     = useRouter();
  const items      = useCartStore(selectCartItems);
  const subtotal   = useCartStore(selectSubtotal);
  const clearCart  = useCartStore((s) => s.clearCart);
  const userEmail  = useAuthStore(selectUserEmail);
  const userName   = useAuthStore(selectUserName);

  // ── Cupón ────────────────────────────────────────────────────
  const [codigoCupon,   setCodigoCupon]   = useState('');
  const [cuponAplicado, setCuponAplicado] = useState<CuponValidado | null>(null);
  const [cuponError,    setCuponError]    = useState<string | null>(null);
  const [validandoCupon, startCuponTx]   = useTransition();

  // ── Cálculos ─────────────────────────────────────────────────
  const descuento          = cuponAplicado?.descuentoAplicado ?? 0;
  const subtotalConDescuento = subtotal - descuento;
  const shippingCost       = subtotalConDescuento >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total              = subtotalConDescuento + shippingCost;

  // ── Formulario de envío ───────────────────────────────────────
  const [form, setForm] = useState<ShippingForm>({
    nombre:     userName?.split(' ')[0] ?? '',
    apellido:   userName?.split(' ').slice(1).join(' ') ?? '',
    email:      userEmail ?? '',
    telefono:   '',
    direccion:  '',
    ciudad:     '',
    region:     '',
    comentario: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const isFormValid =
    form.nombre && form.apellido && form.email && form.telefono &&
    form.direccion && form.ciudad && form.region;

  // ── Estado de submit ──────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Aplicar cupón ─────────────────────────────────────────────
  const handleAplicarCupon = () => {
    if (!codigoCupon.trim()) return;
    setCuponError(null);

    startCuponTx(async () => {
      try {
        const data = await publicQuery<{ validarCupon: CuponValidado }>(
          VALIDAR_CUPON,
          { companyId: COMPANY_ID, codigo: codigoCupon.trim(), subtotal },
          0
        );
        const r = data.validarCupon;
        if (r.valido) { setCuponAplicado(r); setCuponError(null); }
        else          { setCuponAplicado(null); setCuponError(r.mensaje); }
      } catch {
        setCuponAplicado(null);
        setCuponError('No se pudo validar el cupón. Intenta nuevamente.');
      }
    });
  };

  const handleQuitarCupon = () => {
    setCuponAplicado(null);
    setCuponError(null);
    setCodigoCupon('');
  };

  // ── Confirmar pedido ──────────────────────────────────────────
  const handleConfirmarPedido = async () => {
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Obtener token Cognito si está autenticado
      let authToken: string | undefined;
      try {
        const session = await fetchAuthSession();
        authToken = session.tokens?.idToken?.toString();
      } catch { /* usuario no autenticado — pedido como invitado */ }

      // Construir items del pedido desde el carrito
      const pedidoItems = items.map(({ product, quantity }) => ({
        productoId: product.itemId,
        nombre:     product.nombre,
        precio:     product.precio,
        cantidad:   quantity,
        subtotal:   product.precio * quantity,
        imagenUrl:  product.imagenUrl ?? null,
        sku:        product.sku ?? null,
      }));

      const notas = [
        `Dirección: ${form.direccion}, ${form.ciudad}, ${form.region}`,
        form.telefono ? `Tel: ${form.telefono}` : null,
        form.comentario ? `Nota: ${form.comentario}` : null,
        cuponAplicado ? `Cupón: ${cuponAplicado.codigo}` : null,
      ].filter(Boolean).join(' | ');

      const input = {
        companyId:     COMPANY_ID,
        emailCliente:  form.email,
        nombreCliente: `${form.nombre} ${form.apellido}`.trim(),
        items:         JSON.stringify(pedidoItems),  // DynamoDB espera string para arrays en CatalogoInput
        subtotal,
        descuento,
        total,
        notas,
      };

      // Usar privateQuery si hay token, publicQuery si es invitado
      // (crearPedido requiere Cognito — si no hay sesión mostramos error)
      if (!authToken) {
        setSubmitError('Debes iniciar sesión para confirmar el pedido.');
        setSubmitting(false);
        return;
      }

      const result = await privateQuery<{ crearPedido: { statusCode: number; message: string; data?: string } }>(
        CREAR_PEDIDO,
        { input },
        authToken
      );

      if (result.crearPedido.statusCode !== 200) {
        setSubmitError(result.crearPedido.message);
        setSubmitting(false);
        return;
      }

      // Parsear numero del pedido desde data
      let numeroPedido = 'PED-???';
      try {
        const data = JSON.parse(result.crearPedido.data ?? '{}');
        numeroPedido = data.numero ?? numeroPedido;
      } catch { /* ignorar */ }

      // Vaciar carrito y redirigir a confirmación
      clearCart();
      router.push(`/checkout/confirmacion?numero=${encodeURIComponent(numeroPedido)}&email=${encodeURIComponent(form.email)}&total=${total}`);

    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Error al procesar el pedido. Intenta nuevamente.');
      setSubmitting(false);
    }
  };

  // ── Carrito vacío ─────────────────────────────────────────────
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
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/productos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Seguir comprando
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
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
                  <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan" required />
                </div>
                <div className="space-y-1">
                  <label htmlFor="apellido" className="text-sm font-medium">
                    Apellido <span className="text-destructive">*</span>
                  </label>
                  <Input id="apellido" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Pérez" required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="juan@email.com" required />
                </div>
                <div className="space-y-1">
                  <label htmlFor="telefono" className="text-sm font-medium">
                    Teléfono <span className="text-destructive">*</span>
                  </label>
                  <Input id="telefono" name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="+56 9 1234 5678" required />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="direccion" className="text-sm font-medium">
                  Dirección <span className="text-destructive">*</span>
                </label>
                <Input id="direccion" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle Ejemplo 123, Depto 45" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="ciudad" className="text-sm font-medium">
                    Ciudad <span className="text-destructive">*</span>
                  </label>
                  <Input id="ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Santiago" required />
                </div>
                <div className="space-y-1">
                  <label htmlFor="region" className="text-sm font-medium">
                    Región <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="region" name="region" value={form.region} onChange={handleChange} required
                    className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Seleccionar región</option>
                    {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="comentario" className="text-sm font-medium">
                  Comentarios (opcional)
                </label>
                <textarea
                  id="comentario" name="comentario" value={form.comentario} onChange={handleChange}
                  rows={3} placeholder="Instrucciones especiales para el despacho..."
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
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {product.imagenUrl ? (
                        <Image src={product.imagenUrl} alt={product.nombre} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{product.nombre}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(product.precio)}</p>
                      <Badge variant="secondary" className="text-xs mt-1">×{quantity}</Badge>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0">
                      {formatPrice(product.precio * quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Cupón */}
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-primary" />
                  Código de descuento
                </p>

                {cuponAplicado ? (
                  <div className="flex items-center justify-between rounded-md bg-green-50 dark:bg-green-950/20 px-3 py-2 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">{cuponAplicado.codigo}</p>
                        <p className="text-xs text-green-600">
                          {cuponAplicado.tipo === 'porcentaje'
                            ? `${cuponAplicado.valor}% de descuento`
                            : `${formatPrice(cuponAplicado.valor ?? 0)} de descuento`}
                        </p>
                      </div>
                    </div>
                    <button onClick={handleQuitarCupon} className="text-muted-foreground hover:text-foreground" aria-label="Quitar cupón">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: DESCUENTO10"
                      value={codigoCupon}
                      onChange={(e) => { setCodigoCupon(e.target.value.toUpperCase()); setCuponError(null); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAplicarCupon()}
                      className="uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                      disabled={validandoCupon}
                    />
                    <Button variant="outline" onClick={handleAplicarCupon} disabled={!codigoCupon.trim() || validandoCupon} className="flex-shrink-0">
                      {validandoCupon ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : 'Aplicar'}
                    </Button>
                  </div>
                )}

                {cuponError && (
                  <div className="flex items-center gap-2 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{cuponError}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Totales */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Descuento ({cuponAplicado?.codigo})
                    </span>
                    <span>-{formatPrice(descuento)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  {shippingCost === 0
                    ? <span className="text-green-600 font-medium">Gratis</span>
                    : <span>{formatPrice(shippingCost)}</span>}
                </div>
                {subtotalConDescuento < SHIPPING_THRESHOLD && shippingCost > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Agrega <span className="font-medium">{formatPrice(SHIPPING_THRESHOLD - subtotalConDescuento)}</span> más para envío gratis
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {/* Error de submit */}
              {submitError && (
                <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-md">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Botón de confirmar pedido */}
              <Button
                className="w-full" size="lg"
                disabled={!isFormValid || submitting}
                onClick={handleConfirmarPedido}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirmar pedido
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Pago 100% seguro y encriptado
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
