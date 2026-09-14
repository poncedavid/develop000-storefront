import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'develop000 | Tu tienda online',
    template: '%s | develop000',
  },
  description:
    'Tu tienda online de confianza. Productos de calidad con envío rápido a todo Chile.',
  keywords: ['tienda online', 'e-commerce', 'productos', 'Chile'],
  authors: [{ name: 'develop000' }],
  creator: 'develop000',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'develop000',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// viewport separado de metadata — Next.js 14+ recomienda exportarlo aparte
// viewport-fit=cover es necesario para iOS con notch (safe area insets)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
