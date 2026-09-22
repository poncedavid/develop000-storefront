'use client';

/**
 * ShareButton — botón para compartir la URL actual.
 *
 * Estrategia:
 * 1. Si el browser soporta navigator.share → usa Web Share API (mobile nativo)
 * 2. Si no → copia la URL al portapapeles y muestra toast de confirmación
 *
 * No usa el URL como prop para evitar errores en SSR (window.location no existe).
 * La URL se lee en el handler (solo se ejecuta client-side).
 */

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  title:     string;
  text?:     string;
  className?: string;
}

export function ShareButton({ title, text, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    // Web Share API — disponible en mobile Safari, Chrome Android, etc.
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        // El usuario canceló el share — no es un error real
        if ((error as Error).name !== 'AbortError') {
          console.error('[ShareButton] share error:', error);
        }
      }
      return;
    }

    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('¡Enlace copiado!', {
        description: 'El enlace del producto fue copiado al portapapeles.',
        duration: 3000,
      });
      // Resetear ícono después de 2s
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar el enlace.');
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      className={cn('h-9 w-9 flex-shrink-0', className)}
      aria-label="Compartir producto"
      title="Compartir producto"
    >
      {copied
        ? <Check className="h-4 w-4 text-green-500" />
        : <Share2 className="h-4 w-4" />
      }
    </Button>
  );
}
