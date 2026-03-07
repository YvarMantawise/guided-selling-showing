'use client'

// src/components/home/Testimonials.tsx
// ============================================
// Herbruikbaar component Testimonials
// ============================================

import { useState } from 'react'
import Image from 'next/image'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  image?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Wilma',
    role: 'Klant sinds 2025',
    content: 'Ik ben via een collega bij Berino terecht gekomen vanwege haarverlies. Ik heb de haaranalyse gedaan bij Bertina en voelde mij gelijk gehoord en gezien. Wat een vak vrouw! Samen hebben we een behandelplan opgezet met producten van Miriam Quevedo. We zijn inmiddels 8 weken verder en er is al een wereld van verschil! Het haarverlies is al zo goed als gestopt en ik zie al veel nieuwe haren. Wat kan je blij worden van die stekeltjes! Ik gun iedereen een Bertina in zo\'n situatie.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Grietje Vogelzang',
    role: 'Klant sinds 2023',
    content: 'Vandaag heb ik een Japenese Headspa gehad. Een hele fijne, ontspannende behandeling! Voordat de Japanese Headspa begint, wordt er eerst een hoofdhuidscan gemaakt met behulp van een scoop. Na de behandeling wordt er opnieuw een scan gemaakt. Op mijn hoofdhuid heb ik last van psoriasis. Na de behandeling was er een groot verschil te zien, namelijk geen korsten meer. De Japanese Headspa is zeker een aanrader!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Wendy Westerhof',
    role: 'Klant sinds 2023',
    content: 'Na Corona te hebben gehad in December enorme last van haaruitval. Door een prima advies van Bertina de eigenaresse van de zaak enorm goed geholpen. Er werd op microscopisch niveau gekeken naar mijn hoofdhuid en haar en aan de hand daarvan werd er een behandel plan gemaakt met producten van Medicuticals. Deze producten zijn geschikt voor speciale behandelingen waaronder ook extreme haaruitval. Inmiddels is de haaruitval gestopt en hoop ik dat mijn dikke bos weer terug komt. Ik blijf voorlopig deze producten wel gebruiken.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Doetie Beijert',
    role: 'Klant sinds 2022',
    content: 'Begin dit jaar ontzettend veel last van schilffers, haaruitval en jeuk. Van de huisarts recept gehad, vervolgens dermatoloog bezocht die weer iets anders voorschreef... niets hielp :-(. M\'n kapster heeft mij getipt over Berino in Grou. Vervolgens een afspraak gemaakt. Na een analyse van m\'n hoofdhuid is er een 5 stappen gemaakt met producten van Mediceuticals. Na 2 weken gebruik was er wonder gebeurd! Hoofdhuid was nagenoeg schoon en nu na een half jaar zijn al m\'n hoofdhuidproblemen voorbij en heb ik mijn "eigen" bos haar terug. Natuurlijk gebruik ik nu alleen nog de producten van Mediceuticals. Bertina natuurlijk nog enorm bedankt voor de professionele en vriendelijke behandeling - TOP!',
    rating: 5,
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Show 3 testimonials on desktop, 1 on mobile
  const visibleCount = 3

  const nextSlide = () => {
    setActiveIndex((prev) => 
      prev + 1 >= testimonials.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setActiveIndex((prev) => 
      prev - 1 < 0 ? testimonials.length - 1 : prev - 1
    )
  }

  // Get visible testimonials
  const getVisibleTestimonials = (): Testimonial[] => {
    const visible: Testimonial[] = []
    for (let i = 0; i < visibleCount; i++) {
      const index = (activeIndex + i) % testimonials.length
      const testimonial = testimonials[index]
      if (testimonial) {
        visible.push(testimonial)
      }
    }
    return visible
  }

  return (
    <section className="section-padding bg-berino-cream">
      <div className="container-berino">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-berino-forest uppercase tracking-wider mb-3">
            Ervaringen
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-berino-charcoal mb-4">
            Wat Onze Klanten Zeggen
          </h2>
          <p className="text-berino-gray text-lg">
            Ontdek hoe anderen hun haar- en hoofdhuidproblemen hebben opgelost.
          </p>
        </div>

        {/* Testimonials Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {getVisibleTestimonials().map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>

        {/* Testimonials Carousel - Mobile */}
        <div className="md:hidden">
          {testimonials[activeIndex] && (
            <TestimonialCard testimonial={testimonials[activeIndex]} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-white border border-berino-mint/50 flex items-center justify-center text-berino-forest hover:bg-berino-forest hover:text-white hover:border-berino-forest transition-all duration-200 shadow-subtle"
            aria-label="Vorige testimonial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === activeIndex 
                    ? 'bg-berino-forest w-8' 
                    : 'bg-berino-mint hover:bg-berino-sage-light'
                }`}
                aria-label={`Ga naar testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-white border border-berino-mint/50 flex items-center justify-center text-berino-forest hover:bg-berino-forest hover:text-white hover:border-berino-forest transition-all duration-200 shadow-subtle"
            aria-label="Volgende testimonial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-card border border-berino-mint/20 flex flex-col h-full min-h-[420px]">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote - flex-1 zorgt dat deze de ruimte opvult */}
      <blockquote className="text-berino-charcoal text-sm leading-relaxed mb-6 flex-1">
        "{testimonial.content}"
      </blockquote>

      {/* Author - mt-auto zorgt dat deze altijd onderaan blijft */}
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-12 h-12 rounded-full bg-berino-mint/50 flex items-center justify-center flex-shrink-0">
          {testimonial.image ? (
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-berino-forest font-semibold text-lg">
              {testimonial.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-berino-charcoal">{testimonial.name}</p>
          <p className="text-sm text-berino-gray">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}
