'use client'

// src/components/advies/ProductAanbevelingen.tsx
// ============================================
// Displays recommended products from Shopify
// based on AI analysis results
// ============================================

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'

interface Product {
  id: string
  title: string
  handle: string
  description: string
  featuredImage: {
    url: string
    altText: string | null
  } | null
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: {
    id: string
    title: string
    price: { amount: string; currencyCode: string }
    availableForSale: boolean
  }[]
}

interface ProductAanbevelingenProps {
  products: Product[]
}

export default function ProductAanbevelingen({ products }: ProductAanbevelingenProps) {
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN

  // Build add to cart URL for a product
  const buildAddToCartUrl = (product: Product) => {
    const variant = product.variants[0]
    if (!variant || !shopifyDomain) return null
    
    // Extract numeric ID from Shopify GID
    const variantId = variant.id.replace('gid://shopify/ProductVariant/', '')
    // Use cart/add to add to cart (not direct checkout)
    return `https://${shopifyDomain}/cart/add?id=${variantId}&quantity=1`
  }

  // Format price
  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount))
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-berino-charcoal mb-3">
          Aanbevolen Voor Jou
        </h2>
        <p className="text-berino-gray">
          Op basis van je analyse hebben we deze producten voor je geselecteerd.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const addToCartUrl = buildAddToCartUrl(product)
          const price = product.priceRange.minVariantPrice
          const isAvailable = product.variants.some(v => v.availableForSale)

          return (
            <div 
              key={product.id}
              className="bg-white rounded-2xl shadow-card border border-berino-mint/30 overflow-hidden group hover:shadow-card-hover transition-all duration-300"
            >
              {/* Product Image */}
              <Link href={`/store/${product.handle}`} className="block relative aspect-square bg-berino-offwhite overflow-hidden">
                {product.featuredImage?.url ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-berino-mint">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Recommended Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-berino-forest text-white text-xs font-medium rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Aanbevolen
                  </span>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-5">
                <Link href={`/store/${product.handle}`}>
                  <h3 className="font-heading text-lg font-semibold text-berino-charcoal mb-2 hover:text-berino-forest transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                </Link>

                {/* Description (truncated) */}
                {product.description && (
                  <p className="text-sm text-berino-gray mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Price & CTA */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xl font-semibold text-berino-charcoal">
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>

                  {isAvailable && addToCartUrl ? (
                    <a
                      href={addToCartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-berino-forest text-white text-sm font-semibold rounded-xl hover:bg-berino-forest-dark transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Toevoegen
                    </a>
                  ) : (
                    <span className="text-sm text-berino-gray">Niet beschikbaar</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* View All Products Link */}
      <div className="text-center mt-10">
        <Link href="/store">
          <Button variant="secondary">
            Bekijk alle producten
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  )
}
