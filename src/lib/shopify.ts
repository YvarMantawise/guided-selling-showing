// src/lib/shopify.ts
// ============================================
// SHOPIFY ADMIN API CLIENT (met Client Credentials)
// ============================================
// Dit bestand gebruikt de Client Credentials flow om producten op te halen
// via de Admin API in plaats van de Storefront API

// Environment variables
const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN // bijv: voorbeeld-store.myshopify.com
const clientId = process.env.SHOPIFY_CLIENT_ID
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET

// Cache voor de access token (verloopt na 24 uur)
let cachedToken: { token: string; expiresAt: number } | null = null

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
// CLIENT CREDENTIALS TOKEN FLOW
// ============================================

/**
 * Haal een access token op via de Client Credentials flow
 * Tokens zijn 24 uur geldig, we cachen ze
 */
async function getAccessToken(): Promise<string> {
  // Check of we een geldige cached token hebben
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  if (!shopDomain || !clientId || !clientSecret) {
    throw new Error(
      'Shopify configuratie ontbreekt! Zorg dat SHOPIFY_SHOP_DOMAIN, SHOPIFY_CLIENT_ID en SHOPIFY_CLIENT_SECRET zijn ingesteld.'
    )
  }

  const tokenUrl = `https://${shopDomain}/admin/oauth/access_token`

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Token request failed:', errorText)
    throw new Error(`Kon geen access token krijgen: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  
  // Cache de token (expires_in is in seconden, we nemen 23 uur voor zekerheid)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (23 * 60 * 60 * 1000), // 23 uur in milliseconden
  }

  return data.access_token
}

// ============================================
// ADMIN API FETCH HELPER (met retry bij 401)
// ============================================

async function adminApiFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const endpoint = `https://${shopDomain}/admin/api/2024-01/graphql.json`

  // Interne functie die de daadwerkelijke API call doet
  async function doFetch(): Promise<Response> {
    const accessToken = await getAccessToken()
    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache voor 60 seconden
    } as RequestInit)
  }

  let response = await doFetch()

  // Als we een 401 krijgen: token is ongeldig geworden
  // Wis de cache, haal een nieuwe token op, en probeer het nog één keer
  if (response.status === 401) {
    console.warn('401 ontvangen van Admin API — token cache wordt gewist en opnieuw geprobeerd...')
    cachedToken = null
    response = await doFetch()
  }

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
