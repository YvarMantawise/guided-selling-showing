// src/lib/shopify.ts
// ============================================
// SHOPIFY ADMIN API CLIENT (met statisch access token)
// ============================================
// Gebruikt een statisch Admin API access token (shpat_xxx) van een Shopify
// Custom App. De OAuth Client Credentials flow werkt niet vanuit Vercel omdat
// admin.shopify.com achter Cloudflare bot protection zit die datacenter IPs blokkeert.

// Environment variables
const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN // bijv: berino-shop.myshopify.com
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN // shpat_xxx van Custom App

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
// ADMIN API FETCH HELPER
// ============================================

async function adminApiFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!shopDomain || !accessToken) {
    throw new Error(
      'Shopify configuratie ontbreekt! Zorg dat SHOPIFY_SHOP_DOMAIN en SHOPIFY_ACCESS_TOKEN zijn ingesteld.'
    )
  }

  const endpoint = `https://${shopDomain}/admin/api/2024-01/graphql.json`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  } as RequestInit)

  if (!response.ok) {
    throw new Error(`Admin API fout: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors) {
    console.error('GraphQL fouten:', json.errors)
    throw new Error(json.errors[0].message)
  }

  return json.data
}

// ============================================
// GRAPHQL QUERIES (Admin API versie)
// ============================================

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first, query: "status:active") {
      edges {
        node {
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
                price
                compareAtPrice
              }
            }
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
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
                price
                compareAtPrice
              }
            }
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
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
    productByHandle(handle: $handle) {
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
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price
            compareAtPrice
          }
        }
      }
      priceRangeV2 {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
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
// HELPER: Transform Admin API response naar ons format
// ============================================

function transformProduct(node: Record<string, unknown>): ShopifyProduct {
  const images = node.images as { edges?: Array<{ node: ShopifyImage }> } | undefined
  const variants = node.variants as { edges?: Array<{ node: Record<string, unknown> }> } | undefined
  const priceRangeV2 = node.priceRangeV2 as { minVariantPrice?: ShopifyPrice; maxVariantPrice?: ShopifyPrice } | undefined

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
      price: {
        amount: e.node.price as string,
        currencyCode: 'EUR',
      },
      compareAtPrice: e.node.compareAtPrice ? {
        amount: e.node.compareAtPrice as string,
        currencyCode: 'EUR',
      } : null,
    })) || [],
    priceRange: {
      minVariantPrice: priceRangeV2?.minVariantPrice || { amount: '0', currencyCode: 'EUR' },
      maxVariantPrice: priceRangeV2?.maxVariantPrice || { amount: '0', currencyCode: 'EUR' },
    },
  }
}

// ============================================
// EXPORTEERBARE FUNCTIES
// ============================================

/**
 * Haal meerdere producten op
 */
export async function getProducts(first: number = 20): Promise<ShopifyProduct[]> {
  try {
    const data = await adminApiFetch<{ products: { edges: Array<{ node: Record<string, unknown> }> } }>(
      PRODUCTS_QUERY, 
      { first }
    )
    
    return data.products.edges.map(({ node }) => transformProduct(node))
  } catch (error) {
    console.error('Fout bij ophalen producten:', error)
    return []
  }
}

// Type voor de response van de products by tag query
interface ProductsByTagResponse {
  products: {
    edges: Array<{ node: Record<string, unknown> }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

/**
 * Haal alle producten op met een specifieke tag (met pagination)
 * @param tag - De tag om op te filteren (bijv. "h&h")
 * @param batchSize - Hoeveel producten per API call (max 250)
 */
export async function getProductsByTag(tag: string, batchSize: number = 50): Promise<ShopifyProduct[]> {
  try {
    const allProducts: ShopifyProduct[] = []
    let hasNextPage = true
    let cursor: string | null = null

    // Bouw de query string voor Shopify
    // Format: tag:"h&h" AND status:active
    const queryString = `tag:"${tag}" AND status:active`

    while (hasNextPage) {
      const response: ProductsByTagResponse = await adminApiFetch<ProductsByTagResponse>(
        PRODUCTS_BY_TAG_QUERY, 
        {
          first: batchSize,
          query: queryString,
          after: cursor,
        }
      )

      // Voeg de producten toe aan onze verzameling
      const products = response.products.edges.map(({ node }) => transformProduct(node))
      allProducts.push(...products)

      // Check of er nog meer pagina's zijn
      hasNextPage = response.products.pageInfo.hasNextPage
      cursor = response.products.pageInfo.endCursor

      // Veiligheidscheck: stop na 1000 producten om oneindige loops te voorkomen
      if (allProducts.length >= 1000) {
        console.warn('Maximum van 1000 producten bereikt, stoppen met ophalen')
        break
      }
    }

    console.log(`Totaal ${allProducts.length} producten opgehaald met tag "${tag}"`)
    return allProducts
  } catch (error) {
    console.error('Fout bij ophalen producten op tag:', error)
    return []
  }
}

/**
 * Haal één product op via de handle
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const data = await adminApiFetch<{ productByHandle: Record<string, unknown> | null }>(
      PRODUCT_BY_HANDLE_QUERY, 
      { handle }
    )
    
    if (!data.productByHandle) return null
    return transformProduct(data.productByHandle)
  } catch (error) {
    console.error('Fout bij ophalen product:', error)
    return null
  }
}

/**
 * Haal meerdere producten op via hun handles
 * Wordt gebruikt door de advies pagina voor aanbevolen producten
 */
export async function getProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
  try {
    const productPromises = handles.map(handle => getProductByHandle(handle))
    const results = await Promise.all(productPromises)
    return results.filter((product): product is ShopifyProduct => product !== null)
  } catch (error) {
    console.error('Fout bij ophalen producten via handles:', error)
    return []
  }
}

/**
 * Haal alle collecties op
 */
export async function getCollections(first: number = 10) {
  try {
    const data = await adminApiFetch<{ collections: { edges: Array<{ node: Record<string, unknown> }> } }>(
      COLLECTIONS_QUERY, 
      { first }
    )
    
    return data.collections.edges.map(({ node }) => node)
  } catch (error) {
    console.error('Fout bij ophalen collecties:', error)
    return []
  }
}

/**
 * Haal producten uit een collectie op
 */
export async function getCollectionProducts(_handle: string, _first: number = 20): Promise<ShopifyCollection | null> {
  // Voor nu retourneren we null - kan later uitgebreid worden
  return null
}

// ============================================
// HULPFUNCTIES
// ============================================

/**
 * Formatteer prijs naar Nederlandse notatie
 */
export function formatPrice(price: ShopifyPrice): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(parseFloat(price.amount))
}

/**
 * Bereken kortingspercentage
 */
export function calculateDiscount(originalPrice: ShopifyPrice, salePrice: ShopifyPrice): number {
  const original = parseFloat(originalPrice.amount)
  const sale = parseFloat(salePrice.amount)
  
  if (original <= 0) return 0
  return Math.round(((original - sale) / original) * 100)
}
