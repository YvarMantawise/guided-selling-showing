// src/app/store/page.tsx
// De Store pagina die producten toont vanuit Shopify
// Gesplitst per merk: Mediceuticals en Miriam Quevedo

import { Suspense } from 'react'
import { getProductsByTag } from '@/lib/shopify'
import StoreContent from '@/components/store/StoreContent'

// ============================================
// DATA FETCHING (Server Component)
// ============================================

async function StoreData() {
  const allProducts = await getProductsByTag('h&h')

  // Split producten op titel (alle producten hebben al tag h&h)
  const mediceuticals = allProducts.filter(
    (p) => p.title.toLowerCase().includes('mediceuticals')
  )
  const miriamQuevedo = allProducts.filter(
    (p) => p.title.toLowerCase().includes('miriam quevedo')
  )
  // Eventuele producten die niet bij een van de twee horen
  const overige = allProducts.filter(
    (p) =>
      !p.title.toLowerCase().includes('mediceuticals') &&
      !p.title.toLowerCase().includes('miriam quevedo')
  )

  return (
    <StoreContent
      mediceuticals={mediceuticals}
      miriamQuevedo={miriamQuevedo}
      overige={overige}
    />
  )
}

// ============================================
// LOADING SKELETON
// ============================================

function StoreSkeleton() {
  return (
    <div className="space-y-8">
      {/* Skeleton panels */}
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-80 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function StorePage() {
  return (
    <div className="min-h-screen bg-berino-offwhite">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-berino-forest via-berino-forest to-berino-sage py-16 lg:py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-berino-mint/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Premium haar- & hoofdhuidproducten
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl font-semibold text-white mb-4">
            Onze Producten
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Ontdek onze zorgvuldig geselecteerde collectie van professionele haar- en hoofdhuidproducten.
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FFFEF9"/>
          </svg>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-berino-mint/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-berino-mint/30">
            <div className="flex items-center justify-center gap-3 py-4">
              <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span className="text-berino-gray text-sm">Bezorging €2,99 in heel Nederland</span>
            </div>
            <div className="flex items-center justify-center gap-3 py-4">
              <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-berino-gray text-sm">Veilig betalen</span>
            </div>
            <div className="flex items-center justify-center gap-3 py-4">
              <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-berino-gray text-sm">14 dagen retour</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<StoreSkeleton />}>
            <StoreData />
          </Suspense>
        </div>
      </section>
    </div>
  )
}

// ============================================
// METADATA
// ============================================

export const metadata = {
  title: 'Producten | Haar & Hoofdhuid Specialist',
  description: 'Ontdek onze collectie van premium haar- en hoofdhuidproducten van Mediceuticals en Miriam Quevedo.',
}
