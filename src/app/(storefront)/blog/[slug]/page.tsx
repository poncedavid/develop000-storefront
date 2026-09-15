/**
 * Página de detalle de artículo del Blog
 * SSG con ISR — generateStaticParams para artículos publicados
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_ARTICULOS, GET_ARTICULO_DETALLE } from '@/lib/graphql/queries';
import { COMPANY_ID } from '@/lib/config';
import type { ArticleListResponse, Article } from '@/types';

export const revalidate = 300;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getAllArticulos(): Promise<Article[]> {
  try {
    const data = await publicQuery<{ listarArticulos: ArticleListResponse }>(
      LISTAR_ARTICULOS,
      { companyId: COMPANY_ID, limit: 50 },
      300
    );
    return data.listarArticulos.items.filter(
      (a) => a.activo && a.estado === 'publicado'
    );
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const articulos = await getAllArticulos();
  return articulos.map((a) => ({ slug: a.slug || a.itemId }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const articulos = await getAllArticulos();
  const articulo = articulos.find((a) => a.slug === slug || a.itemId === slug);

  if (!articulo) return { title: 'Artículo no encontrado' };

  return {
    title: articulo.titulo,
    description: articulo.resumen || `Lee "${articulo.titulo}" en el blog de develop000`,
    openGraph: {
      title: articulo.titulo,
      description: articulo.resumen,
      images: articulo.imagenUrl ? [articulo.imagenUrl] : [],
    },
  };
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Buscar en el listado (ya está en cache de Next.js)
  const articulos = await getAllArticulos();
  const articuloBase = articulos.find((a) => a.slug === slug || a.itemId === slug);
  if (!articuloBase) notFound();

  // Obtener detalle completo con contenido
  let articulo: Article = articuloBase;
  try {
    const data = await publicQuery<{ getArticuloDetalle: Article }>(
      GET_ARTICULO_DETALLE,
      { id: articuloBase.id, sort: articuloBase.sort },
      300
    );
    if (data.getArticuloDetalle) articulo = data.getArticuloDetalle;
  } catch {
    // Fallback al artículo del listado si falla el detalle
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al blog
          </Link>
        </Button>
      </div>

      {/* Header del artículo */}
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold leading-tight mb-4">
            {articulo.titulo}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            {articulo.autor && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {articulo.autor}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(articulo.publishedAt ?? articulo.createdAt)}
            </span>
          </div>

          {/* Imagen de portada */}
          {articulo.imagenUrl && (
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted mb-6">
              <Image
                src={articulo.imagenUrl}
                alt={articulo.titulo}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Resumen destacado */}
          {articulo.resumen && (
            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 italic">
              {articulo.resumen}
            </p>
          )}
        </header>

        <Separator className="mb-8" />

        {/* Contenido del artículo */}
        {articulo.contenido ? (
          <div
            className="prose prose-slate max-w-none
              prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-4 prose-li:mb-1
              prose-strong:font-semibold
              prose-a:text-primary prose-a:underline"
          >
            {/* Renderizamos el contenido como texto por ahora
                En producción se puede usar un parser de markdown como react-markdown */}
            {articulo.contenido.split('\n').map((paragraph, i) => (
              paragraph.trim() ? (
                <p key={i}>{paragraph}</p>
              ) : (
                <br key={i} />
              )
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mb-3 opacity-30" />
            <p>Contenido no disponible</p>
          </div>
        )}
      </article>

      {/* Footer del artículo */}
      <Separator className="mt-12 mb-6" />
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Más artículos
          </Link>
        </Button>
      </div>
    </div>
  );
}
