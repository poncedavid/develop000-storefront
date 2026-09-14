'use client';

/**
 * Inicializa Amplify una sola vez en el cliente.
 * Se monta en el layout raíz como un componente vacío.
 */
import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './amplify-config';

let configured = false;

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  if (!configured) {
    Amplify.configure(amplifyConfig, { ssr: true });
    configured = true;
  }

  return <>{children}</>;
}
