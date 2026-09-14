/**
 * Home Page del Storefront
 * Hero + Categorías + Productos destacados
 */

import Link from 'next/link';
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductGrid } from '@/components/products/product-grid';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_PRODUCTOS, LISTAR_CATEGORIAS } from '@/lib/graphql/queries';
import type { ProductListResponse, CategoryListResponse, Product, Category } from '@/types';

// Configuración de la empresa (después mover a env o config)
const COMPANY_ID = 'develop000';

// Revalidar cada 60 segundos (ISR)
export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  try {
    const data = await publicQuery<{ listarProductos: ProductListResponse }>(
      LISTAR_PRODUCTOS,
      { companyId: COMPANY_ID, limit: 10 },
      60
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
      { companyId: COMPANY_ID, limit: 8 },
      60
    );
    return data.listarCategorias.items.filter((c) => c.activo);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Beneficios de la tienda
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
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
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
                <Button size="lg" variant="outline" asChild>
                  <Link href="/categorias">Explorar categorías</Link>
                </Button>
              </div>
            </div>

            {/* Imagen hero (placeholder por ahora) */}
            <div className="relative hidden md:block">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-6xl">🛍️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BENEFICIOS
          ═══════════════════════════════════════════════════════════ */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-center gap-3">
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
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORÍAS
          ═══════════════════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Categorías</h2>
            <Button variant="ghost" asChild>
              <Link href="/categorias">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug || category.itemId}`}
              >
                <Card className="group overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="mb-3 mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {category.nombre}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          PRODUCTOS DESTACADOS
          ═══════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Productos destacados</h2>
          <Button variant="ghost" asChild>
            <Link href="/productos">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid
          products={products}
          emptyMessage="Próximamente agregaremos productos"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA FINAL
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para empezar a comprar?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Regístrate ahora y obtén un 10% de descuento en tu primera compra.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/registro">
              Crear cuenta gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
