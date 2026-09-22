/**
 * Home Page del Storefront
 * Hero + Banners + Categorías + Productos destacados
 */

import Link from 'next/link';
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductGrid } from '@/components/products/product-grid';
import { BannerCarousel } from '@/components/banners/banner-carousel';
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';
import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_PRODUCTOS, LISTAR_CATEGORIAS, LISTAR_BANNERS } from '@/lib/graphql/queries';
import {
  COMPANY_ID,
  REVALIDATE_PRODUCTS,
  REVALIDATE_CATEGORIES,
  REVALIDATE_BANNERS,
  PAGE_SIZE_HOME,
  PAGE_SIZE_CATEGORIES,
} from '@/lib/config';
import type { ProductListResponse, CategoryListResponse, BannerListResponse, Product, Category, Banner } from '@/types';

// Next.js requiere un literal estático — no puede evaluar variables importadas en build time
// El valor real viene de REVALIDATE_PRODUCTS = 60 en lib/config.ts
export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  try {
    const data = await publicQuery<{ listarProductos: ProductListResponse }>(
      LISTAR_PRODUCTOS,
      { companyId: COMPANY_ID, limit: PAGE_SIZE_HOME },
      REVALIDATE_PRODUCTS
    );
    return data.listarProductos.items.filter((p) => p.activo);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const data = await publicQuery<{ listarCategorias: CategoryListResponse }>(
      LISTAR_CATEGORIAS,
      { companyId: COMPANY_ID, limit: PAGE_SIZE_CATEGORIES },
      REVALIDATE_CATEGORIES
    );
    return data.listarCategorias.items.filter((c) => c.activo);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getBanners(): Promise<Banner[]> {
  try {
    const data = await publicQuery<{ listarBanners: BannerListResponse }>(
      LISTAR_BANNERS,
      { companyId: COMPANY_ID, limit: 5 },
      REVALIDATE_BANNERS
    );
    return data.listarBanners.items
      .filter((b) => b.activo)
      .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}


const benefits = [
  {
    icon: Truck,
    title: 'Envío gratis',
    description: 'En compras sobre $50.000',
  },
  {
    icon: Shield,
    title: 'Compra segura',
    description: 'Tus datos protegidos',
  },
  {
    icon: CreditCard,
    title: 'Múltiples pagos',
    description: 'Tarjetas y transferencia',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Estamos para ayudarte',
  },
];

export default async function HomePage() {
  const [products, categories, banners] = await Promise.all([
    getProducts(),
    getCategories(),
    getBanners(),
  ]);

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════════
          HERO / BANNER CAROUSEL
          Si hay banners activos, muestra el carrusel.
          Si no, muestra el hero estático de fallback.
          ═══════════════════════════════════════════════════════════ */}
      {banners.length > 0 ? (
        <section className="container mx-auto px-4 pt-6">
          <BannerCarousel banners={banners} />
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <FadeIn direction="left">
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl xl:text-6xl">
                    Descubre productos{' '}
                    <span className="text-primary">increíbles</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md">
                    Encuentra todo lo que necesitas con los mejores precios y envío
                    rápido a todo Chile.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" asChild>
                      <Link href="/productos">
                        Ver productos
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="/categorias">Explorar categorías</Link>
                    </Button>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.15}>
                <div className="relative hidden md:block">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-6xl">🛍️</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          BENEFICIOS
          ═══════════════════════════════════════════════════════════ */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <FadeInStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {benefits.map((benefit) => (
              <FadeInItem key={benefit.title}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORÍAS
          ═══════════════════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <FadeIn>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Categorías</h2>
              <Button variant="ghost" asChild>
                <Link href="/categorias">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 items-stretch">
            {categories.slice(0, 8).map((category) => (
              <FadeInItem key={category.itemId}>
                <Link
                  href={`/categorias/${category.slug || category.itemId}`}
                  className="flex h-full"
                >
                  <Card className="group flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                    <CardContent className="flex flex-col items-center justify-center flex-1 p-6 text-center">
                      <div className="mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h3 className="font-medium group-hover:text-primary transition-colors text-sm line-clamp-2">
                        {category.nombre}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          PRODUCTOS DESTACADOS
          ═══════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Productos destacados</h2>
            <Button variant="ghost" asChild>
              <Link href="/productos">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        <ProductGrid
          products={products}
          emptyMessage="Próximamente agregaremos productos"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEWSLETTER
          ═══════════════════════════════════════════════════════════ */}
      <FadeIn>
        <NewsletterForm />
      </FadeIn>

      {/* El NewsletterForm arriba reemplaza el CTA antiguo */}
    </div>
  );
}
