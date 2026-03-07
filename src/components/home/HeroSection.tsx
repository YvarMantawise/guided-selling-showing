'use client'

// src/components/home/HeroSection.tsx
// ============================================
// Hero sectie (herbruikbaar) voor de landingspagina
// ============================================

import { Button } from '@/components/ui'

interface HeroSectionProps {
  onAnalyseClick: () => void
}

export default function HeroSection({ onAnalyseClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft gradient circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-berino-mint/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-berino-sage-light/20 rounded-full blur-3xl" />
        
        {/* Subtle pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #52796F 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container-berino relative">
        <div className="py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-berino-mint/50 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-berino-forest rounded-full animate-pulse" />
              <span className="text-sm font-medium text-berino-forest">
                AI-gestuurde analyse
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-berino-charcoal mb-6 animate-slide-up">
              Ontdek de Gezondheid
              <br />
              <span className="text-gradient">van Jouw Hoofdhuid</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-berino-gray max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Mooi haar begint bij een gezonde hoofdhuid.
              Onze AI-analyse bekijkt jouw unieke haar- en hoofdhuidkenmerken 
              om een gepersonaliseerd verzorgingsplan samen te stellen.
            </p>

            {/* CTA Button */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={onAnalyseClick}
                className="group"
              >
                Start Jouw Analyse
                <svg 
                  className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 text-berino-gray">
                <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Gratis</span>
              </div>
              <div className="flex items-center gap-2 text-berino-gray">
                <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">5 minuten</span>
              </div>
              <div className="flex items-center gap-2 text-berino-gray">
                <svg className="w-5 h-5 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Persoonlijk advies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="#FAFAF8"
          />
        </svg>
      </div>
    </section>
  )
}
