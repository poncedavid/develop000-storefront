import { Truck, Clock, MapPin, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const revalidate = false;

export const metadata = {
  title: 'Envíos',
  description: 'Información sobre envíos y tiempos de entrega',
};

export default function EnviosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Política de Envíos</h1>
      <p className="text-muted-foreground mb-10">
        Todo lo que necesitas saber sobre cómo despachamos tus pedidos.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 mb-10 items-stretch">
        <Card className="flex flex-col">
          <CardContent className="flex flex-1 items-start gap-4 pt-6">
            <Truck className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Envío gratis</p>
              <p className="text-sm text-muted-foreground">En compras sobre $50.000 a todo Chile.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardContent className="flex flex-1 items-start gap-4 pt-6">
            <Clock className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Tiempos de entrega</p>
              <p className="text-sm text-muted-foreground">RM: 1-2 días hábiles. Regiones: 3-5 días hábiles.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardContent className="flex flex-1 items-start gap-4 pt-6">
            <MapPin className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Cobertura</p>
              <p className="text-sm text-muted-foreground">Despachamos a todo Chile continental.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardContent className="flex flex-1 items-start gap-4 pt-6">
            <Package className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Embalaje seguro</p>
              <p className="text-sm text-muted-foreground">Todos los productos son embalados con cuidado para llegar en perfecto estado.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Costos de envío</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Zona</th>
                  <th className="text-left py-2 font-semibold">Compra bajo $50.000</th>
                  <th className="text-left py-2 font-semibold">Compra sobre $50.000</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">Región Metropolitana</td>
                  <td className="py-2">$2.990</td>
                  <td className="py-2 text-green-600 font-medium">Gratis</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">Regiones cercanas (V, VI)</td>
                  <td className="py-2">$3.990</td>
                  <td className="py-2 text-green-600 font-medium">Gratis</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Resto de regiones</td>
                  <td className="py-2">$4.990</td>
                  <td className="py-2 text-green-600 font-medium">Gratis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">¿Cómo hacer seguimiento?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Una vez que tu pedido sea despachado, recibirás un correo electrónico con el número de tracking y un enlace para seguir tu envío en tiempo real a través del sitio del courier.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Problemas con el envío</h2>
          <p className="text-muted-foreground leading-relaxed">
            Si tu pedido llega dañado, incompleto o no lo recibiste en el plazo indicado, contáctanos a contacto@develop000.cl con tu número de pedido y te ayudaremos a resolverlo.
          </p>
        </section>
      </div>
    </div>
  );
}
