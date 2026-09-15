'use client';

/**
 * Página de confirmación de pedido
 * Se muestra después de crear el pedido exitosamente
 * Recibe numero, email y total via searchParams
 */

import { Suspense }  from 'react';
import Link          from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Button }    from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils/format';

function ConfirmacionContent() {
  const searchParams  = useSearchParams();
  const numero        = searchParams.get('numero') ?? 'PED-???';
  const email         = searchParams.get('email')  ?? '';
  const totalStr      = searchParams.get('total')  ?? '0';
  const total         = parseFloat(totalStr);

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg text-center">
      {/* Ícono de éxito */}
      <div className="flex justify-center mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">¡Pedido confirmado!</h1>
      <p className="text-muted-foreground mb-8">
        Gracias por tu compra. Procesaremos tu pedido a la brevedad.
      </p>

      <Card className="text-left mb-8">
        <CardContent className="pt-6 space-y-4">
          {/* Número de pedido */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Número de pedido
            </span>
            <span className="font-mono font-bold text-primary">{numero}</span>
          </div>

          {/* Total */}
          {total > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total pagado</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </>
          )}

          {/* Email de confirmación */}
          {email && (
            <>
              <Separator />
              <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Confirmación enviada
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                    Revisa tu correo <strong>{email}</strong> para ver el detalle del pedido.
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Próximos pasos */}
      <div className="text-left mb-8 space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">¿Qué sigue?</h2>
        {[
          'Recibirás un email de confirmación con el detalle de tu pedido',
          'Procesaremos tu pedido en las próximas horas hábiles',
          'Te notificaremos cuando sea despachado con el número de seguimiento',
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
              {i + 1}
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1" asChild>
          <Link href="/productos">
            Seguir comprando
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/cuenta">
            Ver mis pedidos
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}
