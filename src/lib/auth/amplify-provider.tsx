'use client';

/**
 * Inicializa Amplify v6 una sola vez en el cliente.
 *
 * Estrategia: configurar síncronamente en el render pero SOLO en el cliente
 * usando el flag `configured` fuera del componente.
 *
 * - `configured` garantiza que solo se llama una vez (React Strict Mode monta 2 veces)
 * - Se ejecuta en el render del cliente, no en useEffect, por lo que
 *   Amplify está listo ANTES de cualquier interacción del usuario
 * - No causa hydration mismatch porque el componente no renderiza nada de estado
 */
import { Amplify }       from 'aws-amplify';
import { amplifyConfig } from './amplify-config';

let configured = false;

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  // Configurar una sola vez en el cliente (typeof window !== 'undefined' = cliente)
  if (!configured && typeof window !== 'undefined') {
    Amplify.configure(amplifyConfig, { ssr: false });
    configured = true;
  }

  return <>{children}</>;
}
