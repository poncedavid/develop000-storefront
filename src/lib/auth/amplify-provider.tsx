'use client';

/**
 * Inicializa Amplify v6 una sola vez en el cliente.
 *
 * IMPORTANTE: la configuración debe ocurrir en el cliente (useEffect),
 * no en el servidor. Las variables NEXT_PUBLIC_* se inyectan en el bundle
 * de cliente en build time — en SSR pueden no estar disponibles.
 */
import { useEffect } from 'react';
import { Amplify }   from 'aws-amplify';
import { amplifyConfig } from './amplify-config';

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Solo configurar una vez en el cliente
    Amplify.configure(amplifyConfig, { ssr: false });
  }, []);

  return <>{children}</>;
}
