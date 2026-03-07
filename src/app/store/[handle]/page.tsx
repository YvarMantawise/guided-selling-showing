// src/app/store/[handle]/page.tsx
// Individuele product detail pagina

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProductByHandle, getProducts, formatPrice, calculateDiscount } from '@/lib/shopify'
import AddToCartButton from '@/components/AddToCartButton'

// ============================================
// TYPES
// ============================================

interface ProductPageProps {
  params: Promise<{
    handle: string
  }>
}

// ============================================
// PRODUCT PAGE
// ============================================

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  const firstVariant = product.variants[0]
  const hasDiscount = firstVariant?.compareAtPrice && 
    parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount)
  
  const discount = hasDiscount && firstVariant.compareAtPrice
    ? calculateDiscount(firstVariant.compareAtPrice, firstVariant.price)
    : 0

  const isAvailable = product.variants.some(v => v.availableForSale)

  return (
    <div className="min-h-screen bg-berino-offwhite">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-berino-mint/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="text-berino-gray hover:text-berino-forest transition-colors"
            >
              Home
            </Link>
            <svg className="w-4 h-4 text-berino-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link 
              href="/store" 
              className="text-berino-gray hover:text-berino-forest transition-colors"
            >
              Producten
            </Link>
            <svg className="w-4 h-4 text-berino-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-berino-charcoal font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left: Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-berino-mint/30 shadow-card">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-berino-cream">
                    <svg className="w-24 h-24 text-berino-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Discount Badge */}
                {hasDiscount && discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.slice(0, 5).map((image, index) => (
                    <div 
                      key={index}
                      className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-berino-mint/30 hover:border-berino-forest transition-colors cursor-pointer bg-white"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.title} - ${index + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="mb-6">
                {product.vendor && (
                  <p className="text-sm font-semibold uppercase tracking-wider text-berino-sage mb-2">
                    {product.vendor}
                  </p>
                )}

                <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-berino-charcoal mb-4">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-berino-forest">
                    {formatPrice(product.priceRange.minVariantPrice)}
                  </span>
                  
                  {hasDiscount && firstVariant.compareAtPrice && (
                    <span className="text-xl text-berino-gray line-through">
                      {formatPrice(firstVariant.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-6">
                {isAvailable ? (
                  <>
                    <span className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-green-600 font-medium">Op voorraad</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full">
                      <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-red-600 font-medium">Uitverkocht</span>
                  </>
                )}
              </div>

              {/* Variants */}
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-berino-charcoal mb-3">Variant</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <span
                        key={variant.id}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                          variant.availableForSale
                            ? 'border-berino-mint bg-white text-berino-charcoal hover:border-berino-forest cursor-pointer'
                            : 'border-gray-200 text-gray-300 bg-gray-50 line-through cursor-not-allowed'
                        }`}
                      >
                        {variant.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mb-8">
                <AddToCartButton 
                  variantId={firstVariant?.id || ''} 
                  quantity={1}
                  disabled={!isAvailable}
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-berino-mint/30 mb-8">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-berino-mint/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <span className="text-berino-charcoal text-xs font-medium">Gratis verzending</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-berino-mint/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-berino-charcoal text-xs font-medium">Veilig betalen</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-berino-mint/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-berino-charcoal text-xs font-medium">14 dagen retour</span>
                </div>
              </div>

              {/* Product Type & Tags */}
              {(product.productType || product.tags.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {product.productType && (
                    <span className="px-3 py-1 bg-berino-forest/10 text-berino-forest text-xs font-medium rounded-full">
                      {product.productType}
                    </span>
                  )}
                  {product.tags.slice(0, 5).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-berino-cream text-berino-gray text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description Section - Full Width Below */}
      {product.descriptionHtml && (
        <section className="py-12 bg-white border-t border-berino-mint/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-semibold text-berino-charcoal mb-6">
              Productomschrijving
            </h2>
            
            {/* Render HTML description with proper styling */}
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-heading prose-headings:text-berino-charcoal prose-headings:font-semibold
                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-berino-gray prose-p:leading-relaxed prose-p:mb-4
                prose-ul:my-4 prose-ul:space-y-2
                prose-li:text-berino-gray prose-li:leading-relaxed
                prose-li:marker:text-berino-forest
                prose-strong:text-berino-charcoal prose-strong:font-semibold
                prose-a:text-berino-forest prose-a:underline hover:prose-a:text-berino-forest-dark
              "
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </section>
      )}

      {/* Back to Store */}
      <section className="py-8 bg-berino-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link 
            href="/store" 
            className="inline-flex items-center gap-2 text-berino-forest hover:text-berino-forest-dark transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Bekijk meer producten
          </Link>
        </div>
      </section>
    </div>
  )
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    return { title: 'Product Niet Gevonden | Haar & Hoofdhuid Specialist' }
  }

  return {
    title: `${product.title} | Haar & Hoofdhuid Specialist`,
    description: product.description || `Bekijk ${product.title} - professionele haar- en hoofdhuidverzorging`,
    openGraph: {
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  }
}

// ============================================
// STATIC PARAMS
// ============================================

export async function generateStaticParams() {
  try {
    const products = await getProducts(100)
    return products.map((product) => ({ handle: product.handle }))
  } catch (error) {
    console.error('Kon producten niet ophalen voor static generation:', error)
    return []
  }
}

export const dynamicParams = true
