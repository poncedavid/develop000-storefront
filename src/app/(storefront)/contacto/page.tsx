import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const revalidate = false; // estático siempre

export const metadata = {
  title: 'Contacto',
  description: 'Contáctanos — estamos para ayudarte',
};

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-muted-foreground mb-10">Estamos aquí para ayudarte. Escríbenos o llámanos.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Datos de contacto */}
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">contacto@develop000.cl</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-muted-foreground">+56 9 1234 5678</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-muted-foreground">Santiago, Chile</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Horario de atención</p>
                <p className="text-muted-foreground">Lunes a viernes, 9:00 – 18:00</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulario simple */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-lg">Envíanos un mensaje</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mensaje</label>
                <textarea
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Enviar mensaje
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
