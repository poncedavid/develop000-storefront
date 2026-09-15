/**
 * Página de listado del Blog
 * SSG con ISR — revalida cada 5 minutos
 */

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { publicQuery } from '@/lib/graphql/client';
import { LISTAR_ARTICULOS } from '@/lib/graphql/queries';
import { COMPANY_ID } from '@/lib/config';
import type { ArticleListResponse, Article } from '@/types';

export const revalidate = 300; // 5 min

export const metadata = {
  title: 'Blog',
  description: 'Artículos, novedades y consejos de develop000',
};

async function getArticulos(): Promise<Article[]> {
  try {
    const data = await publicQuery<{ listarArticulos: ArticleListResponse }>(
      LISTAR_ARTICULOS,
      { companyId: COMPANY_ID, limit: 50 },
      300
    );
    return data.listarArticulos.items
      .filter((a) => a.activo && a.estado === 'publicado')
      .sort((a, b) => {
        const dateA = a.publishedAt ?? a.createdAt;
        const dateB = b.publishedAt ?? b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
  } catch (error) {
    console.error('Error fetching articulos:', error);
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export default async function BlogPage() {
  const articulos = await getArticulos();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Blog
        </h1>
        <p className="text-muted-foreground mt-2">
          Artículos, novedades y consejos
        </p>
      </div>

      {articulos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <BookOpen className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg">No hay artículos publicados aún</p>
          <p className="text-sm mt-1">Vuelve pronto</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articulos.map((articulo) => (
            <Link
              key={articulo.itemId}
              href={`/blog/${articulo.slug || articulo.itemId}`}
              className="flex"
            >
              <Card className="group flex flex-col w-full overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                {/* Imagen de portada */}
                <div className="relative aspect-video bg-muted overflow-hidden flex-shrink-0">
                  {articulo.imagenUrl ? (
                    <Image
                      src={articulo.imagenUrl}
                      alt={articulo.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <BookOpen className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                </div>

                <CardContent className="flex flex-1 flex-col p-5 gap-3">
                  {/* Título */}
                  <h2 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {articulo.titulo}
                  </h2>

                  {/* Resumen */}
                  {articulo.resumen && (
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                      {articulo.resumen}
                    </p>
                  )}

                  {/* Meta — autor + fecha al fondo */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2 border-t">
                    {articulo.autor && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {articulo.autor}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(articulo.publishedAt ?? articulo.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
