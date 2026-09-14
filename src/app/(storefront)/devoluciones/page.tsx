import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const revalidate = false;

export const metadata = {
  title: 'Devoluciones',
  description: 'Política de devoluciones y cambios de productos',
};

export default function DevolucionesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Política de Devoluciones</h1>
      <p className="text-muted-foreground mb-10">
        Tu satisfacción es nuestra prioridad. Tienes 30 días para devolver cualquier producto.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <Card className="text-center">
          <CardContent className="pt-6">
            <RotateCcw className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-semibold">30 días</p>
            <p className="text-sm text-muted-foreground">para solicitar devolución</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold">Reembolso completo</p>
            <p className="text-sm text-muted-foreground">al mismo método de pago</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="font-semibold">5-10 días hábiles</p>
            <p className="text-sm text-muted-foreground">para procesar el reembolso</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">¿Qué productos se pueden devolver?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Aceptamos devolución</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>Productos sin usar y en estado original</li>
                  <li>Con embalaje original intacto</li>
                  <li>Con todos los accesorios incluidos</li>
                  <li>Productos defectuosos o dañados</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">No aceptamos devolución</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>Productos usados o lavados</li>
                  <li>Sin embalaje original</li>
                  <li>Ropa interior o artículos de higiene</li>
                  <li>Productos personalizados</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">¿Cómo solicitar una devolución?</h2>
          <ol className="space-y-3">
            {[
              'Contáctanos a contacto@develop000.cl indicando tu número de pedido y el motivo de la devolución.',
              'Te enviaremos las instrucciones para el retiro del producto en tu domicilio o indicaremos el punto de entrega más cercano.',
              'Una vez recibido y verificado el producto, procesaremos el reembolso en un plazo de 5 a 10 días hábiles.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
