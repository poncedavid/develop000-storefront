/**
 * Queries GraphQL para el storefront
 * Corresponden al schema del backend develop000
 */

// ════════════════════════════════════════════════════════════════
// PRODUCTOS
// ════════════════════════════════════════════════════════════════

export const LISTAR_PRODUCTOS = /* GraphQL */ `
  query ListarProductos($companyId: String!, $nextToken: String, $limit: Int) {
    listarProductos(companyId: $companyId, nextToken: $nextToken, limit: $limit) {
      items {
        id
        sort
        itemId
        companyId
        nombre
        descripcion
        slug
        precio
        precioComparar
        sku
        stock
        categoriaId
        marcaId
        imagenUrl
        activo
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`;

export const GET_PRODUCTO_DETALLE = /* GraphQL */ `
  query GetProductoDetalle($id: String!, $sort: String!) {
    getProductoDetalle(id: $id, sort: $sort) {
      id
      sort
      itemId
      companyId
      nombre
      descripcion
      slug
      precio
      precioComparar
      sku
      stock
      categoriaId
      marcaId
      imagenUrl
      activo
      createdAt
      updatedAt
    }
  }
`;

// ════════════════════════════════════════════════════════════════
// CATEGORÍAS
// ════════════════════════════════════════════════════════════════

export const LISTAR_CATEGORIAS = /* GraphQL */ `
  query ListarCategorias($companyId: String!, $nextToken: String, $limit: Int) {
    listarCategorias(companyId: $companyId, nextToken: $nextToken, limit: $limit) {
      items {
        id
        sort
        itemId
        companyId
        nombre
        descripcion
        slug
        imagenUrl
        activo
        createdAt
      }
      nextToken
      total
    }
  }
`;

export const GET_CATEGORIA_DETALLE = /* GraphQL */ `
  query GetCategoriaDetalle($id: String!, $sort: String!) {
    getCategoriaDetalle(id: $id, sort: $sort) {
      id
      sort
      itemId
      companyId
      nombre
      descripcion
      slug
      imagenUrl
      activo
      createdAt
    }
  }
`;

// ════════════════════════════════════════════════════════════════
// MARCAS
// ════════════════════════════════════════════════════════════════

export const LISTAR_MARCAS = /* GraphQL */ `
  query ListarMarcas($companyId: String!, $nextToken: String, $limit: Int) {
    listarMarcas(companyId: $companyId, nextToken: $nextToken, limit: $limit) {
      items {
        id
        sort
        itemId
        companyId
        nombre
        descripcion
        slug
        logoUrl
        activo
        createdAt
      }
      nextToken
      total
    }
  }
`;

// ════════════════════════════════════════════════════════════════
// PEDIDOS (requieren auth)
// ════════════════════════════════════════════════════════════════

export const CREAR_PEDIDO = /* GraphQL */ `
  mutation CrearPedido($input: CatalogoInput!) {
    crearPedido(input: $input) {
      statusCode
      message
    }
  }
`;
