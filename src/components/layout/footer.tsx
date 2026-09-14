/**
 * Footer del storefront
 */

import Link from 'next/link';
import { Globe, Camera, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  tienda: [
    { name: 'Productos', href: '/productos' },
    { name: 'Categorías', href: '/categorias' },
    { name: 'Ofertas', href: '/productos?ofertas=true' },
    { name: 'Novedades', href: '/productos?nuevos=true' },
  ],
  ayuda: [
    { name: 'Contacto', href: '/contacto' },
    { name: 'Preguntas frecuentes', href: '/faq' },
    { name: 'Envíos', href: '/envios' },
    { name: 'Devoluciones', href: '/devoluciones' },
  ],
  legal: [
    { name: 'Términos y condiciones', href: '/terminos' },
    { name: 'Política de privacidad', href: '/privacidad' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Globe },
  { name: 'Instagram', href: '#', icon: Camera },
  { name: 'Twitter', href: '#', icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {/* Logo y descripción */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                D
              </div>
              <span className="font-semibold">develop000</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Tu tienda online de confianza. Productos de calidad con envío a
              todo Chile.
            </p>
            {/* Redes sociales */}
            <div className="mt-4 flex gap-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="font-semibold mb-4">Tienda</h3>
            <ul className="space-y-3">
              {footerLinks.tienda.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {footerLinks.ayuda.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} develop000. Todos los derechos
            reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Hecho con ❤️ en Chile
          </p>
        </div>
      </div>
    </footer>
  );
}
