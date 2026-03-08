// src/lib/shopify.ts
// ============================================
// SHOPIFY STOREFRONT API CLIENT
// ============================================
// Gebruikt de Storefront API met een publiek access token.
// Token aanmaken: Shopify Admin → Instellingen → Apps →
// Apps ontwikkelen → [app] → Storefront API-integratie

const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN! // bijv: berino-shop.myshopify.com
const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN! // publiek Storefront API token

// ============================================
// TYPES
// ============================================

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyPrice {
  amount: string
  currencyCode: string
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyPrice
  compareAtPrice: ShopifyPrice | null
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  featuredImage: ShopifyImage | null
  images: ShopifyImage[]
  variants: ShopifyProductVariant[]
  priceRange: {
    minVariantPrice: ShopifyPrice
    maxVariantPrice: ShopifyPrice
  }
}

export interface ShopifyCollection {
  id: string
  title: string
  handle: string
  description: string
  image: ShopifyImage | null
  products: ShopifyProduct[]
}

// ============================================
// STOREFRONT API FETCH HELPER
// ============================================

async function storefrontFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!shopDomain || !storefrontToken) {
    throw new Error(
      'Shopify configuratie ontbreekt! Zorg dat SHOPIFY_SHOP_DOMAIN en SHOPIFY_STOREFRONT_TOKEN zijn ingesteld.'
    )
  }

  const endpoint = `https://${shopDomain}/api/2024-01/graphql.json`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  } as RequestInit)

  if (!response.ok) {
    throw new Error(`Storefront API fout: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors) {
    console.error('GraphQL fouten:', json.errors)
    throw new Error(json.errors[0].message)
  }

  return json.data
}

// ============================================
// GRAPHQL QUERIES (Storefront API)
// ============================================

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  vendor
  productType
  tags
  featuredImage {
    url
    altText
    width
    height
  }
  images(first: 5) {
    edges {
      node {
        url
        altText
        width
        height
      }
    }
  }
  variants(first: 10) {
    edges {
      node {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
    maxVariantPrice {
      amount
      currencyCode
    }
  }
`

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`

const PRODUCTS_BY_TAG_QUERY = `
  query getProductsByTag($first: Int!, $query: String!, $after: String) {
    products(first: $first, query: $query, after: $after) {
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS.replace('images(first: 5)', 'images(first: 10)').replace('variants(first: 10)', 'variants(first: 20)')}
    }
  }
`

const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`

// ============================================
// HELPER: Transform Storefront API response
// ============================================

function transformProduct(node: Record<string, unknown>): ShopifyProduct {
  const images = node.images as { edges?: Array<{ node: ShopifyImage }> } | undefined
  const variants = node.variants as { edges?: Array<{ node: Record<string, unknown> }> } | undefined
  const priceRange = node.priceRange as { minVariantPrice?: ShopifyPrice; maxVariantPrice?: ShopifyPrice } | undefined

  return {
    id: node.id as string,
    title: node.title as string,
    handle: node.handle as string,
    description: (node.description as string) || '',
    descriptionHtml: (node.descriptionHtml as string) || '',
    vendor: (node.vendor as string) || '',
    productType: (node.productType as string) || '',
    tags: (node.tags as string[]) || [],
    featuredImage: node.featuredImage as ShopifyImage | null,
    images: images?.edges?.map((e) => e.node) || [],
    variants: variants?.edges?.map((e) => ({
      id: e.node.id as string,
      title: e.node.title as string,
      availableForSale: e.node.availableForSale as boolean,
      price: e.node.price as ShopifyPrice,
      compareAtPrice: e.node.compareAtPrice as ShopifyPrice | null,
    })) || [],
    priceRange: {
      minVariantPrice: priceRange?.minVariantPrice || { amount: '0', currencyCode: 'EUR' },
      maxVariantPrice: priceRange?.maxVariantPrice || { amount: '0', currencyCode: 'EUR' },
    },
  }
}

// ============================================
// EXPORTEERBARE FUNCTIES
// ============================================

export async function getProducts(first: number = 20): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontFetch<{ products: { edges: Array<{ node: Record<string, unknown> }> } }>(
      PRODUCTS_QUERY,
      { first }
    )
    return data.products.edges.map(({ node }) => transformProduct(node))
  } catch (error) {
    console.error('Fout bij ophalen producten:', error)
    return []
  }
}

interface ProductsByTagResponse {
  products: {
    edges: Array<{ node: Record<string, unknown> }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

export async function getProductsByTag(tag: string, batchSize: number = 50): Promise<ShopifyProduct[]> {
  try {
    const allProducts: ShopifyProduct[] = []
    let hasNextPage = true
    let cursor: string | null = null
    const queryString = `tag:"${tag}"`

    while (hasNextPage) {
      const response: ProductsByTagResponse = await storefrontFetch<ProductsByTagResponse>(
        PRODUCTS_BY_TAG_QUERY,
        { first: batchSize, query: queryString, after: cursor }
      )

      const products = response.products.edges.map(({ node }) => transformProduct(node))
      allProducts.push(...products)

      hasNextPage = response.products.pageInfo.hasNextPage
      cursor = response.products.pageInfo.endCursor

      if (allProducts.length >= 1000) {
        console.warn('Maximum van 1000 producten bereikt')
        break
      }
    }

    return allProducts
  } catch (error) {
    console.error('Fout bij ophalen producten op tag:', error)
    return []
  }
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const data = await storefrontFetch<{ product: Record<string, unknown> | null }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle }
    )
    if (!data.product) return null
    return transformProduct(data.product)
  } catch (error) {
    console.error('Fout bij ophalen product:', error)
    return null
  }
}

export async function getProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
  try {
    const results = await Promise.all(handles.map(handle => getProductByHandle(handle)))
    return results.filter((p): p is ShopifyProduct => p !== null)
  } catch (error) {
    console.error('Fout bij ophalen producten via handles:', error)
    return []
  }
}

export async function getCollections(first: number = 10) {
  try {
    const data = await storefrontFetch<{ collections: { edges: Array<{ node: Record<string, unknown> }> } }>(
      COLLECTIONS_QUERY,
      { first }
    )
    return data.collections.edges.map(({ node }) => node)
  } catch (error) {
    console.error('Fout bij ophalen collecties:', error)
    return []
  }
}

export async function getCollectionProducts(_handle: string, _first: number = 20): Promise<ShopifyCollection | null> {
  return null
}

// ============================================
// HULPFUNCTIES
// ============================================

export function formatPrice(price: ShopifyPrice): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(parseFloat(price.amount))
}

export function calculateDiscount(originalPrice: ShopifyPrice, salePrice: ShopifyPrice): number {
  const original = parseFloat(originalPrice.amount)
  const sale = parseFloat(salePrice.amount)
  if (original <= 0) return 0
  return Math.round(((original - sale) / original) * 100)
}
