/**
 * Página de Contacto — Server Component
 * El formulario interactivo está en ContactoForm ('use client')
 */

import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent }          from '@/components/ui/card';
import { ContactoForm }               from './contacto-form';

export const revalidate = false;

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
          {[
            { icon: Mail,   label: 'Email',     value: 'contacto@develop000.cl' },
            { icon: Phone,  label: 'Teléfono',  value: '+56 9 1234 5678' },
            { icon: MapPin, label: 'Dirección', value: 'Santiago, Chile' },
            { icon: Clock,  label: 'Horario',   value: 'Lunes a viernes, 9:00 – 18:00' },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label}>
              <CardContent className="flex items-start gap-4 pt-6">
                <Icon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-muted-foreground">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Formulario interactivo (Client Component) */}
        <ContactoForm />
      </div>
    </div>
  );
}
