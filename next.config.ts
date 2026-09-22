import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    /**
     * Permitir cualquier hostname para imágenes externas.
     *
     * Justificación: las imágenes de productos/banners se almacenan en S3
     * (o URLs externas configuradas en el backend). No conocemos de antemano
     * todos los dominios — el wildcard `**` cubre todos los casos.
     *
     * En producción con presupuesto de optimización limitado se puede
     * restringir a los dominios propios de S3 (*.amazonaws.com).
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
