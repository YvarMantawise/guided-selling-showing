// src/app/voorwaarden/page.tsx
// ============================================
// Compacte algemene voorwaarden pagina
// ============================================

import Link from 'next/link'

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-berino-offwhite">
      <div className="container-berino section-padding">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-berino-forest hover:text-berino-forest-dark transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Terug naar home
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-berino-charcoal">
              Algemene Voorwaarden
            </h1>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Artikel 1 - Definities
              </h2>
              <ul className="space-y-2 text-berino-gray">
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span><strong>Haar & Hoofdhuid Specialist:</strong> de aanbieder van de online haar- en hoofdhuidanalyse en bijbehorende diensten.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span><strong>Gebruiker:</strong> iedere persoon die gebruik maakt van onze analyse of website.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span><strong>Analyse:</strong> de gratis online haar- en hoofdhuidanalyse met persoonlijk advies.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Artikel 2 - Toepasselijkheid
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Deze algemene voorwaarden zijn van toepassing op elk gebruik van onze website 
                en de haar- en hoofdhuidanalyse. Door gebruik te maken van onze diensten 
                ga je akkoord met deze voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Artikel 3 - De Analyse
              </h2>
              <ul className="space-y-2 text-berino-gray">
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span>De analyse is gratis en vrijblijvend.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span>Het advies is gebaseerd op de door jou verstrekte informatie en is indicatief van aard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span>De analyse vervangt geen medisch advies. Bij ernstige klachten raden wij aan een arts of dermatoloog te raadplegen.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Artikel 4 - Productaanbevelingen
              </h2>
              <p className="text-berino-gray leading-relaxed">
                De productaanbevelingen die voortkomen uit de analyse zijn gebaseerd op 
                de door jou gegeven antwoorden. Aankopen via onze aanbevelingen vallen 
                onder de voorwaarden van de betreffende webshop waar de aankoop wordt gedaan.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Artikel 5 - Aansprakelijkheid
              </h2>
              <ul className="space-y-2 text-berino-gray">
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span>Haar & Hoofdhuid Specialist is niet aansprakelijk voor schade die voortvloeit uit het gebruik van de analyse of het opvolgen van het advies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span>Wij doen ons best om correcte informatie te verstrekken, maar kunnen geen garanties geven over de volledigheid of actualiteit hiervan.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Artikel 6 - Intellectueel Eigendom
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Alle content op deze website, inclusief teksten, afbeeldingen en de 
                analyse-tool, is eigendom van Haar & Hoofdhuid Specialist en mag niet 
                zonder toestemming worden gekopieerd of verspreid.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Artikel 7 - Wijzigingen
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Wij behouden ons het recht voor om deze voorwaarden te wijzigen. 
                De meest recente versie is altijd beschikbaar op deze pagina.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Artikel 8 - Contact
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Heb je vragen over deze voorwaarden? Neem dan contact met ons op via{' '}
                <a 
                  href="mailto:info@haarenhoofdhuidspecialist.nl" 
                  className="text-berino-forest hover:underline"
                >
                  info@haarenhoofdhuidspecialist.nl
                </a>
              </p>
            </section>

            {/* Laatste update */}
            <p className="text-sm text-berino-gray/60 pt-4 border-t border-gray-100">
              Laatste update: februari 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// METADATA
// ============================================

export const metadata = {
  title: 'Algemene Voorwaarden | Haar & Hoofdhuid Specialist',
  description: 'Lees onze algemene voorwaarden voor het gebruik van de haar- en hoofdhuidanalyse.',
}
