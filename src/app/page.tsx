'use client'

// src/app/page.tsx
// ============================================
// Homepage with Hero, How It Works, Testimonials
// and CTA section with AI Analyse Modal
// ============================================

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { HeroSection, HowItWorks, Testimonials, OurExpertise } from '@/components/home'
import { AnalyseModal } from '@/components/analyse'

// Aparte component die useSearchParams gebruikt
function AnalyseModalHandler({ 
  onOpenModal 
}: { 
  onOpenModal: () => void 
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get('analyse') === 'true') {
      onOpenModal()
      // Verwijder de query parameter uit de URL (zonder pagina te herladen)
      router.replace('/', { scroll: false })
    }
  }, [searchParams, router, onOpenModal])

  return null
}

export default function HomePage() {
  const [isAnalyseModalOpen, setIsAnalyseModalOpen] = useState(false)

  // Listen for custom event from Header (als we al op homepage zijn)
  useEffect(() => {
    const handleOpenModal = () => setIsAnalyseModalOpen(true)
    window.addEventListener('open-analyse-modal', handleOpenModal)
    return () => window.removeEventListener('open-analyse-modal', handleOpenModal)
  }, [])

  const openAnalyseModal = () => {
    setIsAnalyseModalOpen(true)
  }

  const closeAnalyseModal = () => {
    setIsAnalyseModalOpen(false)
  }

  return (
    <>
      {/* Suspense boundary voor useSearchParams */}
      <Suspense fallback={null}>
        <AnalyseModalHandler onOpenModal={openAnalyseModal} />
      </Suspense>

      {/* Hero Section */}
      <HeroSection onAnalyseClick={openAnalyseModal} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Expertise / Vision Section */}
      <OurExpertise />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="section-padding bg-berino-offwhite">
        <div className="container-berino">
          <div className="relative overflow-hidden bg-gradient-forest rounded-3xl p-8 md:p-12 lg:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white mb-4">
                Klaar om je Hoofdhuid te Begrijpen?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Start vandaag nog met je gratis analyse en ontdek welke producten 
                het beste passen bij jouw haar en hoofdhuid.
              </p>
              <button
                onClick={openAnalyseModal}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-berino-forest font-semibold text-lg rounded-xl hover:bg-berino-cream transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Gratis Analyse
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Analyse Modal */}
      <AnalyseModal
        isOpen={isAnalyseModalOpen}
        onClose={closeAnalyseModal}
      />
    </>
  )
}
