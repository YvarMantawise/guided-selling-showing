// src/app/privacy/page.tsx
// ============================================
// Compacte privacy pagina
// ============================================

import Link from 'next/link'

export default function PrivacyPage() {
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
              Privacyverklaring
            </h1>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Welke gegevens verzamelen wij?
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Wanneer je onze haar- en hoofdhuidanalyse invult en je rapportage aanvraagt, 
                verzamelen wij de volgende gegevens: je naam, e-mailadres, geslacht, 
                leeftijdscategorie en de antwoorden die je tijdens de analyse hebt gegeven.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Waarvoor gebruiken wij je gegevens?
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Wij gebruiken je gegevens voor de volgende doeleinden:
              </p>
              <ul className="mt-3 space-y-2 text-berino-gray">
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span>Het genereren en versturen van je persoonlijke analyse en productadvies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-berino-forest mt-1">•</span>
                  <span>Het sturen van marketingcommunicatie, zoals aanbiedingen en tips voor haar- en hoofdhuidverzorging</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Afmelden voor marketing
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Je kunt je op elk moment afmelden voor marketingcommunicatie via de 
                afmeldlink onderaan onze e-mails, of door contact met ons op te nemen.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Bewaartermijn
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Wij bewaren je gegevens zolang dit nodig is voor de hierboven genoemde 
                doeleinden, of totdat je ons verzoekt deze te verwijderen.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Je rechten
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Je hebt het recht om je gegevens in te zien, te corrigeren of te laten 
                verwijderen. Neem hiervoor contact met ons op via onderstaande gegevens.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                Contact
              </h2>
              <p className="text-berino-gray leading-relaxed">
                Heb je vragen over deze privacyverklaring of wil je gebruik maken van 
                je rechten? Neem dan contact met ons op via{' '}
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
              Laatste update: februari 2026
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
  title: 'Privacyverklaring | Haar & Hoofdhuid Specialist',
  description: 'Lees hoe wij omgaan met je persoonlijke gegevens.',
}
