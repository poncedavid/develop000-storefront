/**
 * Tipos base del storefront
 * Corresponden al schema GraphQL del backend develop000
 */

// ════════════════════════════════════════════════════════════════
// PRODUCTOS
// ════════════════════════════════════════════════════════════════

export interface Product {
  id: string;
  sort: string;
  itemId: string;
  companyId: string;
  nombre: string;
  descripcion?: string;
  slug?: string;
  precio: number;
  precioComparar?: number;
  sku?: string;
  stock?: number;
  categoriaId?: string;
  marcaId?: string;
  imagenUrl?: string;
  activo: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  items: Product[];
  nextToken?: string | null;
  total?: number;
}

// ════════════════════════════════════════════════════════════════
// CATEGORÍAS
// ════════════════════════════════════════════════════════════════

export interface Category {
  id: string;
  sort: string;
  itemId: string;
  companyId: string;
  nombre: string;
  descripcion?: string;
  slug?: string;
  imagenUrl?: string;
  activo: boolean;
  createdAt: string;
}

export interface CategoryListResponse {
  items: Category[];
  nextToken?: string | null;
  total?: number;
}

// ════════════════════════════════════════════════════════════════
// CARRITO
// ════════════════════════════════════════════════════════════════

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

// ════════════════════════════════════════════════════════════════
// PEDIDOS
// ════════════════════════════════════════════════════════════════

export interface OrderItem {
  productId: string;
  nombre: string;
  precio: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  sort: string;
  companyId: string;
  clienteId?: string;
  items: OrderItem[];
  subtotal: number;
  descuento: number;
  total: number;
  estado: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';
  createdAt: string;
}

// ════════════════════════════════════════════════════════════════
// MARCAS
// ════════════════════════════════════════════════════════════════
export interface Brand {
  id: string;
  sort: string;
  itemId: string;
  companyId: string;
  nombre: string;
  descripcion?: string;
  slug?: string;
  logoUrl?: string;
  activo: boolean;
  createdAt: string;
}
export interface BrandListResponse {
  items: Brand[];
  nextToken?: string | null;
  total?: number;
}

// ════════════════════════════════════════════════════════════════
// BANNERS
// ════════════════════════════════════════════════════════════════
export interface Banner {
  id: string;
  sort: string;
  itemId: string;
  companyId: string;
  titulo: string;
  descripcion?: string;
  imagenUrl: string;
  url?: string;
  orden?: number;
  fechaInicio?: string;
  fechaFin?: string;
  activo: boolean;
  createdAt: string;
}
export interface BannerListResponse {
  items: Banner[];
  nextToken?: string | null;
  total?: number;
}

// ════════════════════════════════════════════════════════════════
// ARTÍCULOS (blog)
// ════════════════════════════════════════════════════════════════
export interface Article {
  id: string;
  sort: string;
  itemId: string;
  companyId: string;
  titulo: string;
  contenido: string;
  resumen?: string;
  slug?: string;
  imagenUrl?: string;
  autor?: string;
  estado?: string;
  publishedAt?: string;
  activo: boolean;
  createdAt: string;
}
export interface ArticleListResponse {
  items: Article[];
  nextToken?: string | null;
  total?: number;
}

// ════════════════════════════════════════════════════════════════
// FAVORITOS
// ════════════════════════════════════════════════════════════════
export interface Favorito {
  sort:              string;
  itemId:            string;
  companyId:         string;
  clienteId:         string;
  productoId:        string;
  productoNombre:    string | null;
  productoSlug:      string | null;
  productoImagenUrl: string | null;
  productoPrecio:    number | null;
  createdAt:         string;
}
export interface FavoritoListResponse {
  items:     Favorito[];
  nextToken: string | null;
  total:     number;
}

// ════════════════════════════════════════════════════════════════
// CUPONES
// ════════════════════════════════════════════════════════════════
export interface CuponValidado {
  valido:            boolean;
  mensaje:           string;
  codigo:            string | null;
  tipo:              'porcentaje' | 'monto_fijo' | null;
  valor:             number | null;
  descuentoAplicado: number;
}

// ════════════════════════════════════════════════════════════════
// CLIENTE (usuario del storefront)
// ════════════════════════════════════════════════════════════════

export interface Customer {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
}

// ════════════════════════════════════════════════════════════════
// API RESPONSES
// ════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}
