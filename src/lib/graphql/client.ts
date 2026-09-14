/**
 * Cliente GraphQL para AppSync
 * Conecta al mismo backend que usa el admin panel
 */

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
  /** Si es true, usa API Key (público). Si no, requiere token de auth */
  isPublic?: boolean;
  /** Token de autenticación para queries privadas */
  authToken?: string;
  /** Cache: 'force-cache' | 'no-store' | número de segundos para revalidate */
  cache?: RequestCache | number;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
}

/**
 * Ejecuta una query/mutation GraphQL contra AppSync
 */
export async function graphqlRequest<T>(
  options: GraphQLRequestOptions
): Promise<T> {
  const { query, variables, isPublic = true, authToken, cache = 'no-store' } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Auth: API Key para público, Bearer token para privado
  if (isPublic && API_KEY) {
    headers['x-api-key'] = API_KEY;
  } else if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Configurar cache para ISR
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  };

  if (typeof cache === 'number') {
    fetchOptions.next = { revalidate: cache };
  } else {
    fetchOptions.cache = cache;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, fetchOptions);

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors?.length) {
    const errorMessages = json.errors.map((e) => e.message).join(', ');
    throw new Error(`GraphQL errors: ${errorMessages}`);
  }

  if (!json.data) {
    throw new Error('No data returned from GraphQL');
  }

  return json.data;
}

/**
 * Helper para queries públicas con ISR (Incremental Static Regeneration)
 * Revalida cada N segundos
 */
export function publicQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidateSeconds = 60
): Promise<T> {
  return graphqlRequest<T>({
    query,
    variables,
    isPublic: true,
    cache: revalidateSeconds,
  });
}

/**
 * Helper para queries que requieren autenticación
 */
export function privateQuery<T>(
  query: string,
  variables: Record<string, unknown>,
  authToken: string
): Promise<T> {
  return graphqlRequest<T>({
    query,
    variables,
    isPublic: false,
    authToken,
    cache: 'no-store',
  });
}
