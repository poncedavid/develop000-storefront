/**
 * Configuración global del storefront
 * Fuente única de verdad para valores de entorno y constantes
 */

// ── AppSync ────────────────────────────────────────────────────
export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

// ── Empresa ────────────────────────────────────────────────────
// companyId del tenant actual — en un multi-tenant real vendría del subdominio
export const COMPANY_ID = process.env.NEXT_PUBLIC_COMPANY_ID ?? 'develop000';

// ── Cache ISR (segundos) ───────────────────────────────────────
export const REVALIDATE_PRODUCTS   = 60;   // productos — cambios frecuentes
export const REVALIDATE_CATEGORIES = 300;  // categorías — cambios raros
export const REVALIDATE_BANNERS    = 120;  // banners — campañas

// ── Paginación ─────────────────────────────────────────────────
export const PAGE_SIZE_HOME      = 10;
export const PAGE_SIZE_CATALOG   = 50;
export const PAGE_SIZE_RELATED   = 4;
export const PAGE_SIZE_CATEGORIES = 8;
