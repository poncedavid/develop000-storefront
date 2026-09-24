'use client';

/**
 * Carrusel de imágenes para la página de detalle de producto.
 *
 * Features:
 * - Imagen principal con thumbnails debajo
 * - Zoom en hover (desktop) con CSS transform scale
 * - Soporte para múltiples imágenes
 * - Fallback con placeholder cuando no hay imagen
 * - Embla Carousel para el scroll suave entre imágenes
 *
 * Patrón de diseño:
 * - Composition: imagen principal + thumbnails son independientes
 * - State local: selectedIndex controlado internamente
 */

import { useState, useCallback, useEffect }  from 'react';
import Image                                  from 'next/image';
import useEmblaCarousel                       from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ShoppingCart, ZoomIn } from 'lucide-react';
import { cn }                                 from '@/lib/utils';

interface ProductImageCarouselProps {
  images:      string[];
  productName: string;
  className?:  string;
}

export function ProductImageCarousel({
  images,
  productName,
  className,
}: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed,      setIsZoomed]      = useState(false);
  const [zoomPos,       setZoomPos]       = useState({ x: 50, y: 50 });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  // Sincronizar selectedIndex con Embla
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Inicializar índice en el primer render
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Zoom: calcular posición del cursor como % dentro de la imagen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)  / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Sin imágenes — placeholder
  if (!images.length) {
    return (
      <div className={cn('relative aspect-square rounded-xl overflow-hidden bg-muted', className)}>
        <div className="flex h-full items-center justify-center">
          <ShoppingCart className="h-24 w-24 text-muted-foreground/20" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Imagen principal con zoom */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => { setIsZoomed(false); setZoomPos({ x: 50, y: 50 }); }}
        onMouseMove={handleMouseMove}
        aria-label={`Imagen de ${productName}`}
      >
        {/* Embla viewport */}
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative min-w-full h-full flex-shrink-0 overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`${productName} — imagen ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={cn(
                    'object-cover transition-transform duration-300 origin-[var(--zoom-x)_var(--zoom-y)]',
                    isZoomed && i === selectedIndex ? 'scale-150' : 'scale-100'
                  )}
                  style={isZoomed && i === selectedIndex
                    ? { '--zoom-x': `${zoomPos.x}%`, '--zoom-y': `${zoomPos.y}%` } as React.CSSProperties
                    : undefined
                  }
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de zoom */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-sm">
            <ZoomIn className="h-4 w-4 text-foreground/70" />
          </div>
        </div>

        {/* Flechas de navegación — solo si hay más de 1 imagen */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              disabled={selectedIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm border transition-all hover:bg-background disabled:opacity-30 z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={selectedIndex === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm border transition-all hover:bg-background disabled:opacity-30 z-10"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots — área de toque mínima 44px */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    'h-6 rounded-full transition-all flex items-center justify-center',
                    i === selectedIndex
                      ? 'w-6 bg-primary'
                      : 'w-6 bg-background/60 hover:bg-background/90'
                  )}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <span className={cn(
                    'rounded-full transition-all pointer-events-none',
                    i === selectedIndex ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-current'
                  )} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails — solo si hay más de 1 imagen */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all',
                i === selectedIndex
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-border hover:border-muted-foreground'
              )}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === selectedIndex}
            >
              <Image
                src={src}
                alt={`${productName} — miniatura ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
