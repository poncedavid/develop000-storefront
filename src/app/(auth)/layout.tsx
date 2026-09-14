/**
 * Layout para páginas de autenticación
 * Centrado, sin header/footer del storefront
 */
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
          D
        </div>
        <span className="text-xl font-bold">develop000</span>
      </Link>

      {children}

      <p className="mt-8 text-xs text-muted-foreground text-center">
        © 2026 develop000 ·{' '}
        <Link href="/terminos" className="hover:underline">Términos</Link>
        {' · '}
        <Link href="/privacidad" className="hover:underline">Privacidad</Link>
      </p>
    </div>
  );
}
