'use client';

import { useState }          from 'react';
import { CheckCircle }       from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button }            from '@/components/ui/button';
import { Input }             from '@/components/ui/input';

export function ContactoForm() {
  const [form, setForm]         = useState({ nombre: '', email: '', mensaje: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res  = await fetch('/api/contacto', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Error al enviar el mensaje.'); }
      else         { setSuccess(true); setForm({ nombre: '', email: '', mensaje: '' }); }
    } catch {
      setError('No se pudo enviar el mensaje. Revisa tu conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="font-semibold text-lg">¡Mensaje enviado!</h2>
            <p className="text-muted-foreground text-sm">
              Gracias por contactarnos. Te responderemos a la brevedad.
            </p>
            <Button variant="outline" onClick={() => setSuccess(false)} className="mt-2">
              Enviar otro mensaje
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <h2 className="font-semibold text-lg">Envíanos un mensaje</h2>

          <div className="space-y-1">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre <span className="text-destructive">*</span>
            </label>
            <Input id="nombre" name="nombre" placeholder="Tu nombre"
              value={form.nombre} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <Input id="email" name="email" type="email" placeholder="tu@email.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <label htmlFor="mensaje" className="text-sm font-medium">
              Mensaje <span className="text-destructive">*</span>
            </label>
            <textarea
              id="mensaje" name="mensaje" rows={4}
              placeholder="¿En qué podemos ayudarte?"
              value={form.mensaje} onChange={handleChange} required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
          )}

          <Button
            type="submit" className="w-full"
            disabled={submitting || !form.nombre || !form.email || !form.mensaje}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Enviando...
              </span>
            ) : 'Enviar mensaje'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
