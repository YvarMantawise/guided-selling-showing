'use client'

// src/components/store/StoreContent.tsx
// ============================================
// Interactieve store content met klikbare merk-panels
// ============================================

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, calculateDiscount, type ShopifyProduct } from '@/lib/shopify'

// ============================================
// TYPES
// ============================================

interface SubCategory {
  label: string
  tag: string
}

interface StoreContentProps {
  mediceuticals: ShopifyProduct[]
  miriamQuevedo: ShopifyProduct[]
  overige: ShopifyProduct[]
}

interface BrandPanelProps {
  title: string
  description: string
  products: ShopifyProduct[]
  accentColor: string
  icon: React.ReactNode
  subCategories?: SubCategory[]
}

// ============================================
// SUB-CATEGORIE CONFIGURATIE
//
// Deze tags moeten exact overeenkomen met de Shopify product tags.
// Gebruik onderstaande strings wanneer je producten tagt in Shopify.
// ============================================

const MEDICEUTICALS_CATEGORIES: SubCategory[] = [
  { label: 'Haaruitval',         tag: 'mediceuticals-haaruitval' },
  { label: 'Hoofdhuidproblemen', tag: 'mediceuticals-hoofdhuidproblemen' },
  { label: 'Haarverzorging',     tag: 'mediceuticals-haarverzorging' },
  { label: 'Haarstyling',        tag: 'mediceuticals-haarstyling' },
  { label: 'Huidverzorging',     tag: 'mediceuticals-huidverzorging' },
]

const MIRIAMQUEVEDO_CATEGORIES: SubCategory[] = [
  { label: 'Haargroei',                 tag: 'miriamquevedo-haargroei' },
  { label: 'Haaruitval',                tag: 'miriamquevedo-haaruitval' },
  { label: 'Vet haar',                  tag: 'miriamquevedo-vet-haar' },
  { label: 'Droge gevoelige hoofdhuid', tag: 'miriamquevedo-droge-gevoelige-hoofdhuid' },
  { label: 'Volume',                    tag: 'miriamquevedo-volume' },
  { label: 'Droog haar',                tag: 'miriamquevedo-droog-haar' },
  { label: 'Haarstyling',               tag: 'miriamquevedo-haarstyling' },
]

// ============================================
// PRODUCT CARD
// ============================================

function ProductCard({ product }: { product: ShopifyProduct }) {
  const firstVariant = product.variants[0]
  const hasDiscount =
    firstVariant?.compareAtPrice &&
    parseFloat(firstVariant.compareAtPrice.amount) >
      parseFloat(firstVariant.price.amount)

  const discount =
    hasDiscount && firstVariant.compareAtPrice
      ? calculateDiscount(firstVariant.compareAtPrice, firstVariant.price)
      : 0

  const isAvailable = product.variants.some((v) => v.availableForSale)

  return (
    <Link href={`/store/${product.handle}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-berino-mint/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Product Afbeelding */}
        <div className="relative aspect-square overflow-hidden bg-berino-cream/30">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-berino-mint"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          )}

          {/* Korting Badge */}
          {hasDiscount && discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Uitverkocht Badge */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm">
                Uitverkocht
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <span className="bg-white text-berino-charcoal px-6 py-2 rounded-full font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Bekijk Product
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Titel */}
          <h3 className="font-semibold text-berino-charcoal text-lg mb-2 line-clamp-2 group-hover:text-berino-forest transition-colors">
            {product.title}
          </h3>

          {/* Beschrijving */}
          {product.description && (
            <p className="text-berino-gray text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Prijs */}
          <div className="flex items-center gap-3">
            <span className="text-berino-charcoal font-bold text-xl">
              {formatPrice(product.priceRange.minVariantPrice)}
            </span>

            {hasDiscount && firstVariant.compareAtPrice && (
              <span className="text-berino-gray line-through text-sm">
                {formatPrice(firstVariant.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Product Type */}
          {product.productType && (
            <div className="mt-3">
              <span className="inline-block bg-berino-forest/10 text-berino-forest text-xs px-2 py-1 rounded-full font-medium">
                {product.productType}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

// ============================================
// BRAND PANEL
// ============================================

function BrandPanel({
  title,
  description,
  products,
  accentColor,
  icon,
  subCategories = [],
}: BrandPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('alle')

  const hasSubCategories = subCategories.length > 0

  // Producten zonder een van de gedefinieerde sub-categorie tags
  const definedTags = subCategories.map((s) => s.tag)
  const overigProducts = products.filter(
    (p) => !p.tags.some((tag) => definedTags.includes(tag))
  )

  // Filter producten op basis van actieve tab
  const filteredProducts = (() => {
    if (activeTab === 'alle') return products
    if (activeTab === 'overige') return overigProducts
    return products.filter((p) => p.tags.includes(activeTab))
  })()

  return (
    <div className="space-y-0">
      {/* Klikbaar Panel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-white rounded-2xl ${isOpen ? 'rounded-b-none' : ''} border border-berino-mint/30 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group`}
      >
        <div className="p-6 md:p-8 flex items-center gap-5">
          {/* Icon */}
          <div
            className={`w-14 h-14 ${accentColor} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>

          {/* Tekst */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-berino-charcoal">
                {title}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-berino-mint/30 text-berino-forest">
                {products.length} {products.length === 1 ? 'product' : 'producten'}
              </span>
            </div>
            <p className="text-berino-gray text-sm md:text-base line-clamp-2">
              {description}
            </p>
          </div>

          {/* Chevron */}
          <div className="flex-shrink-0">
            <svg
              className={`w-6 h-6 text-berino-forest transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Uitklapbaar gedeelte */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border border-t-0 border-berino-mint/30 rounded-b-2xl">

          {/* Sub-categorie filter tabs */}
          {hasSubCategories && (
            <div className="px-6 md:px-8 pt-6 border-b border-berino-mint/20">
              <div className="flex gap-2 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {/* Alle tab */}
                <button
                  onClick={() => setActiveTab('alle')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === 'alle'
                      ? 'bg-berino-forest text-white shadow-sm'
                      : 'bg-berino-mint/20 text-berino-forest hover:bg-berino-mint/40'
                  }`}
                >
                  Alle <span className="opacity-70">({products.length})</span>
                </button>

                {/* Sub-categorie tabs */}
                {subCategories.map((sub) => {
                  const count = products.filter((p) =>
                    p.tags.includes(sub.tag)
                  ).length
                  return (
                    <button
                      key={sub.tag}
                      onClick={() => setActiveTab(sub.tag)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        activeTab === sub.tag
                          ? 'bg-berino-forest text-white shadow-sm'
                          : 'bg-berino-mint/20 text-berino-forest hover:bg-berino-mint/40'
                      }`}
                    >
                      {sub.label} <span className="opacity-70">({count})</span>
                    </button>
                  )
                })}

                {/* Overige tab — alleen tonen als er niet-gecategoriseerde producten zijn */}
                {overigProducts.length > 0 && (
                  <button
                    onClick={() => setActiveTab('overige')}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeTab === 'overige'
                        ? 'bg-berino-charcoal text-white shadow-sm'
                        : 'bg-berino-cream text-berino-charcoal hover:bg-berino-cream/60'
                    }`}
                  >
                    Overige <span className="opacity-70">({overigProducts.length})</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Producten Grid */}
          <div className="p-6 md:p-8">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 text-berino-mint mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-berino-gray">
                  {hasSubCategories
                    ? 'Er zijn geen producten in deze categorie.'
                    : 'Er zijn momenteel geen producten beschikbaar voor dit merk.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN STORE CONTENT
// ============================================

export default function StoreContent({
  mediceuticals,
  miriamQuevedo,
  overige,
}: StoreContentProps) {
  const totalProducts = mediceuticals.length + miriamQuevedo.length + overige.length

  if (totalProducts === 0) {
    return (
      <div className="text-center py-20">
        <svg
          className="w-16 h-16 text-berino-mint mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 className="text-berino-charcoal text-xl font-semibold mb-2">
          Geen producten gevonden
        </h3>
        <p className="text-berino-gray">
          Er zijn momenteel geen producten beschikbaar.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mediceuticals Panel */}
      <BrandPanel
        title="Mediceuticals"
        description="Klinisch bewezen formules voor de gezondheid van haar en hoofdhuid. Gespecialiseerd in oplossingen voor haaruitval, dunner wordend haar en hoofdhuidproblemen."
        products={mediceuticals}
        accentColor="bg-berino-forest/10"
        subCategories={MEDICEUTICALS_CATEGORIES}
        icon={
          <svg
            className="w-7 h-7 text-berino-forest"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
            />
          </svg>
        }
      />

      {/* Miriam Quevedo Panel */}
      <BrandPanel
        title="Miriam Quevedo"
        description="Luxe haarproducten met exclusieve ingrediënten zoals kaviaar, goud en arganolie. Ongeëvenaarde verzorging voor elk haartype."
        products={miriamQuevedo}
        accentColor="bg-berino-sage/20"
        subCategories={MIRIAMQUEVEDO_CATEGORIES}
        icon={
          <svg
            className="w-7 h-7 text-berino-sage"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
            />
          </svg>
        }
      />

      {/* Overige producten (als die er zijn) */}
      {overige.length > 0 && (
        <BrandPanel
          title="Overige Producten"
          description="Andere professionele producten uit onze collectie."
          products={overige}
          accentColor="bg-berino-cream"
          icon={
            <svg
              className="w-7 h-7 text-berino-charcoal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />
      )}
    </div>
  )
}
