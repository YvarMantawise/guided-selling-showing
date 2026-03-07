// src/lib/cart.ts
// ============================================
// SHOPIFY CART FUNCTIES
// ============================================
// Deze functies bouwen URLs om producten toe te voegen aan de Shopify cart

const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN || process.env.SHOPIFY_SHOP_DOMAIN

// ============================================
// CART URL BUILDERS
// ============================================

/**
 * Bouw een URL om een product toe te voegen aan de Shopify cart
 * Gebruiker blijft in de cart en kan verder shoppen
 */
export function buildAddToCartUrl(variantId: string, quantity: number = 1): string {
  if (!shopDomain) {
    throw new Error('SHOPIFY_SHOP_DOMAIN is niet ingesteld')
  }
  
  // Extract het numerieke ID uit het GraphQL ID
  // Van "gid://shopify/ProductVariant/123456789" naar "123456789"
  const numericId = variantId.replace('gid://shopify/ProductVariant/', '')
  
  // Shopify cart/add URL voegt toe aan cart en toont cart pagina
  return `https://${shopDomain}/cart/add?id=${numericId}&quantity=${quantity}`
}

/**
 * Bouw een URL om meerdere producten toe te voegen aan de cart
 */
export function buildMultiAddToCartUrl(items: Array<{ variantId: string; quantity: number }>): string {
  if (!shopDomain) {
    throw new Error('SHOPIFY_SHOP_DOMAIN is niet ingesteld')
  }
  
  // Bouw query params: id[]=123&quantity[]=1&id[]=456&quantity[]=2
  const params = new URLSearchParams()
  
  items.forEach(item => {
    const numericId = item.variantId.replace('gid://shopify/ProductVariant/', '')
    params.append('id[]', numericId)
    params.append('quantity[]', item.quantity.toString())
  })
  
  return `https://${shopDomain}/cart/add?${params.toString()}`
}

/**
 * Bouw een directe checkout URL (voor "Nu kopen" functionaliteit)
 * Slaat cart over en gaat direct naar checkout
 */
export function buildDirectCheckoutUrl(variantId: string, quantity: number = 1): string {
  if (!shopDomain) {
    throw new Error('SHOPIFY_SHOP_DOMAIN is niet ingesteld')
  }
  
  const numericId = variantId.replace('gid://shopify/ProductVariant/', '')
  
  // Dit format gaat direct naar checkout
  return `https://${shopDomain}/cart/${numericId}:${quantity}`
}

/**
 * Bouw URL naar de Shopify cart pagina
 */
export function buildCartUrl(): string {
  if (!shopDomain) {
    throw new Error('SHOPIFY_SHOP_DOMAIN is niet ingesteld')
  }
  
  return `https://${shopDomain}/cart`
}
