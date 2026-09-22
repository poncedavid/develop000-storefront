'use client';

/**
 * BannerCarousel — carrusel de banners para la sección hero del home.
 *
 * Features:
 * - Autoplay cada 5 segundos
 * - Pausa en hover
 * - Dots de navegación
 * - Flechas prev/next
 * - Fade suave entre slides
 * - Fallback decorativo si no hay banners
 *
 * Nota: Acepta la data como prop (el fetch lo hace el Server Component padre).
 * Este componente no fetea nada — solo presenta los datos.
 */

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Banner } from '@/types';

interface BannerCarouselProps {
  banners: Banner[];
  className?: string;
}

export function BannerCarousel({ banners, className }: BannerCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused,      setIsPaused]      = useState(false);

  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [autoplay]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollTo    = useCallback((i: number) => emblaApi?.scrollTo(i),    [emblaApi]);
  const scrollPrev  = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext  = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Sin banners — placeholder decorativo (no se renderiza)
  if (!banners.length) return null;

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl', className)}
      onMouseEnter={() => { setIsPaused(true);  autoplay.stop();  }}
      onMouseLeave={() => { setIsPaused(false); autoplay.play();  }}
      aria-roledescription="carrusel"
      aria-label="Banners promocionales"
    >
      {/* Viewport Embla */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {banners.map((banner, i) => (
            <div
              key={banner.itemId}
              className="relative min-w-full"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} de ${banners.length}: ${banner.titulo}`}
            >
              {/* Imagen de fondo */}
              <div className="relative aspect-[2/1] sm:aspect-[3/1] lg:aspect-[4/1] bg-gradient-to-br from-primary/20 to-primary/5">
                {banner.imagenUrl ? (
                  <Image
                    src={banner.imagenUrl}
                    alt={banner.titulo}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                ) : (
                  // Placeholder decorativo cuando no hay imagen
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-20">🛍️</span>
                  </div>
                )}

                {/* Overlay para legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

                {/* Contenido del banner */}
                <div className="absolute inset-0 flex items-center px-8 sm:px-12">
                  <div className="max-w-md text-white space-y-3">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                      {banner.titulo}
                    </h2>
                    {banner.descripcion && (
                      <p className="text-sm sm:text-base text-white/80 line-clamp-2">
                        {banner.descripcion}
                      </p>
                    )}
                    {banner.url && (
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={banner.url}>Ver más</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flechas de navegación — solo si hay más de 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 shadow-md backdrop-blur-sm border transition-all hover:bg-background/90 z-10"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 shadow-md backdrop-blur-sm border transition-all hover:bg-background/90 z-10"
            aria-label="Banner siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots de navegación */}
      {banners.length > 1 && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
          role="tablist"
          aria-label="Slides del carrusel"
        >
          {banners.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Ir al slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === selectedIndex
                  ? 'w-6 bg-white'
                  : 'w-1.5 bg-white/50 hover:bg-white/80'
              )}
            />
          ))}
        </div>
      )}

      {/* Indicador de pausa (accesibilidad) */}
      {isPaused && (
        <div className="absolute top-3 right-3 z-10 text-xs bg-black/50 text-white px-2 py-1 rounded-full pointer-events-none">
          En pausa
        </div>
      )}
    </div>
  );
}
