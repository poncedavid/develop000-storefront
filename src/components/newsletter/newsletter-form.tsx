'use client';

/**
 * NewsletterForm — formulario de suscripción a newsletter.
 *
 * Llama a /api/newsletter (POST) con el email.
 * La ruta de API guarda el suscriptor en DynamoDB (entidad SUSCRIPTOR).
 *
 * UX:
 * - Validación de email en el cliente antes de enviar
 * - Estado loading con spinner
 * - Toast de éxito / error via sonner
 * - Deshabilita el botón mientras procesa
 */

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterForm() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error('Por favor ingresa un email válido.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al suscribir.');
      }

      toast.success('¡Te suscribiste exitosamente! 🎉', {
        description: 'Recibirás nuestras ofertas y novedades en tu email.',
      });
      setEmail('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido.';
      // Mensaje amigable si ya existe el email
      if (message.toLowerCase().includes('ya')) {
        toast.info('Este email ya está suscrito.');
      } else {
        toast.error('No pudimos procesar tu suscripción. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
              <Mail className="h-6 w-6" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Suscríbete a nuestro newsletter
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Recibe ofertas exclusivas, novedades y descuentos directamente en
            tu bandeja de entrada.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30"
              aria-label="Email para newsletter"
            />
            <Button
              type="submit"
              disabled={loading || !email}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Suscribiendo...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Suscribirme
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-xs text-primary-foreground/50 mt-4">
            Sin spam. Puedes darte de baja cuando quieras.
          </p>
        </div>
      </div>
    </section>
  );
}
