/**
 * Layout del Storefront
 * Incluye Header y Footer en todas las páginas públicas
 */

import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Suspense necesario porque Header usa useSearchParams() */}
      <Suspense fallback={<div className="h-16 w-full border-b bg-background" />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
