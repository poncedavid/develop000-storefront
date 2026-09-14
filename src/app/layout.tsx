import type { Metadata } from 'next';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* viewport-fit=cover para iOS safe area — no va en metadata de Next.js 16 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f172a" />
      </head>
      <body className="min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
