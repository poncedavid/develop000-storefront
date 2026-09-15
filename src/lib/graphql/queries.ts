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
// MARCAS — nueva sección con más queries
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
// BANNERS
// ════════════════════════════════════════════════════════════════
export const LISTAR_BANNERS = /* GraphQL */ `
  query ListarBanners($companyId: String!, $nextToken: String, $limit: Int) {
    listarBanners(companyId: $companyId, nextToken: $nextToken, limit: $limit) {
      items {
        id
        sort
        itemId
        companyId
        titulo
        descripcion
        imagenUrl
        url
        orden
        activo
        createdAt
      }
      nextToken
      total
    }
  }
`;

// ════════════════════════════════════════════════════════════════
// ARTÍCULOS (blog)
// ════════════════════════════════════════════════════════════════
export const LISTAR_ARTICULOS = /* GraphQL */ `
  query ListarArticulos($companyId: String!, $nextToken: String, $limit: Int) {
    listarArticulos(companyId: $companyId, nextToken: $nextToken, limit: $limit) {
      items {
        id
        sort
        itemId
        companyId
        titulo
        resumen
        slug
        imagenUrl
        autor
        estado
        publishedAt
        activo
        createdAt
      }
      nextToken
      total
    }
  }
`;

export const GET_ARTICULO_DETALLE = /* GraphQL */ `
  query GetArticuloDetalle($id: String!, $sort: String!) {
    getArticuloDetalle(id: $id, sort: $sort) {
      id
      sort
      itemId
      companyId
      titulo
      contenido
      resumen
      slug
      imagenUrl
      autor
      estado
      publishedAt
      activo
      createdAt
    }
  }
`;

// ════════════════════════════════════════════════════════════════
// CUPONES — validación pública (API Key)
// ════════════════════════════════════════════════════════════════
export const VALIDAR_CUPON = /* GraphQL */ `
  query ValidarCupon($companyId: String!, $codigo: String!, $subtotal: Float!) {
    validarCupon(companyId: $companyId, codigo: $codigo, subtotal: $subtotal) {
      valido
      mensaje
      codigo
      tipo
      valor
      descuentoAplicado
    }
  }
`;

// ════════════════════════════════════════════════════════════════
// FAVORITOS — requieren Cognito (datos privados por cliente)
// ════════════════════════════════════════════════════════════════
export const LISTAR_FAVORITOS = /* GraphQL */ `
  query ListarFavoritos($companyId: String!, $nextToken: String, $limit: Int) {
    listarFavoritos(companyId: $companyId, nextToken: $nextToken, limit: $limit) {
      items {
        sort
        itemId
        companyId
        clienteId
        productoId
        productoNombre
        productoSlug
        productoImagenUrl
        productoPrecio
        createdAt
      }
      nextToken
      total
    }
  }
`;

export const CREAR_FAVORITO = /* GraphQL */ `
  mutation CrearFavorito($input: CatalogoInput!) {
    crearFavorito(input: $input) {
      statusCode
      message
    }
  }
`;

export const ELIMINAR_FAVORITO = /* GraphQL */ `
  mutation EliminarFavorito($input: CatalogoInput!) {
    eliminarFavorito(input: $input) {
      statusCode
      message
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
