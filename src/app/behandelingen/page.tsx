'use client'

export default function BehandelingenPage() {
  const handleBookingClick = () => {
    window.location.href = 'https://www.berino.nl/afspraak-maken/'
  }

  const behandelingen = [
    {
      title: 'Hoofdhuid Detox Behandeling',
      description:
        'Een diepte-reinigende behandeling die de hoofdhuid ontdoet van opgehoopt talg, productresten en dode huidcellen. Ideaal als basis voor een gezonde haargroei.',
      duration: '45 min',
      icon: (
        <svg className="w-7 h-7 text-berino-forest group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      ),
    },
    {
      title: 'Zuurstof Spa Behandeling',
      description:
        'Een revitaliserende behandeling waarbij zuurstof diep in de hoofdhuid wordt gebracht. Stimuleert de bloedcirculatie en bevordert een gezonde haargroei.',
      duration: '60 min',
      icon: (
        <svg className="w-7 h-7 text-berino-forest group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      title: 'Hydraterende Hoofdhuidkuur',
      description:
        'Speciaal ontwikkeld voor droge en gevoelige hoofdhuid. Deze intensieve kuur herstelt het vochtbalans en kalmeert irritatie voor langdurig comfort.',
      duration: '50 min',
      icon: (
        <svg className="w-7 h-7 text-berino-forest group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      ),
    },
    {
      title: 'Anti-Haaruitval Behandeling',
      description:
        'Een gerichte behandeling voor dunner wordend haar en haaruitval. Met behulp van geavanceerde technieken en producten wordt de haarfollikel versterkt.',
      duration: '60 min',
      icon: (
        <svg className="w-7 h-7 text-berino-forest group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
  ]

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-berino-forest via-berino-forest to-berino-sage">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-berino-mint/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container-berino relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Professionele haar- & hoofdhuidzorg
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
              Onze Behandelingen
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Ontdek onze specialistische behandelingen voor een gezonde hoofdhuid en mooi, vol haar.
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FFFEF9"/>
          </svg>
        </div>
      </section>

      {/* Behandelingen Kaarten Section */}
      <section className="section-padding bg-berino-offwhite">
        <div className="container-berino">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {behandelingen.map((behandeling, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Decorative blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-berino-mint/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-berino-mint/30 transition-colors" />

                <div className="relative flex flex-col flex-1">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-berino-forest/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-berino-forest group-hover:scale-110 transition-all duration-300">
                    {behandeling.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                    {behandeling.title}
                  </h3>

                  {/* Description */}
                  <p className="text-berino-gray leading-relaxed mb-4 flex-1">
                    {behandeling.description}
                  </p>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm text-berino-sage font-medium mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {behandeling.duration}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleBookingClick}
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-berino-forest text-white font-semibold rounded-xl hover:bg-berino-forest/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Afspraak maken
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-white">
        <div className="container-berino">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Tekst links */}
              <div>
                <span className="inline-block text-berino-sage font-medium text-sm uppercase tracking-wider mb-4">
                  Onze aanpak
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-berino-charcoal mb-6">
                  Persoonlijk & professioneel
                </h2>
                <div className="space-y-4 text-berino-gray leading-relaxed">
                  <p>
                    Elke behandeling begint met een uitgebreide analyse van je hoofdhuid en haar.
                    Op basis van deze analyse stellen we een persoonlijk behandelplan op dat precies
                    aansluit bij jouw situatie en wensen.
                  </p>
                  <p>
                    Wij werken uitsluitend met hoogwaardige producten en geavanceerde technieken.
                    Onze specialisten worden continu bijgeschoold om je de beste zorg te kunnen bieden.
                  </p>
                </div>
              </div>

              {/* Decoratieve kaart rechts */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-berino-mint/30 to-berino-sage/20 rounded-3xl transform rotate-3" />
                <div className="relative bg-berino-offwhite rounded-3xl p-8 md:p-10">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-berino-forest rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-berino-charcoal mb-1">Gratis intake gesprek</h4>
                        <p className="text-sm text-berino-gray">We bespreken je wensen en verwachtingen</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-berino-forest rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-berino-charcoal mb-1">Hoofdhuid analyse</h4>
                        <p className="text-sm text-berino-gray">Uitgebreide analyse met moderne apparatuur</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-berino-forest rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-berino-charcoal mb-1">Persoonlijk plan</h4>
                        <p className="text-sm text-berino-gray">Op maat gemaakt behandeltraject</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-berino-forest rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-berino-charcoal mb-1">Nazorg & advies</h4>
                        <p className="text-sm text-berino-gray">Begeleiding ook na de behandeling</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ervaring Section */}
      <section className="relative section-padding bg-berino-cream/50">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-berino-mint/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-berino-sage/20 rounded-full blur-3xl" />
        </div>

        <div className="container-berino relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-berino-sage font-medium text-sm uppercase tracking-wider mb-4">
              Wat je kunt verwachten
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-berino-charcoal mb-6">
              Een behandeling op maat
            </h2>
            <div className="space-y-4 text-lg text-berino-gray leading-relaxed">
              <p>
                Bij Berino draait alles om jouw persoonlijke situatie. Geen standaard
                aanpak, maar een behandeling die volledig is afgestemd op de conditie van
                jouw hoofdhuid en haar.
              </p>
              <p>
                Onze specialisten nemen de tijd om je uitgebreid te informeren en begeleiden
                je door het hele traject — van de eerste analyse tot en met de nazorg.
              </p>
            </div>

            {/* Quote */}
            <div className="mt-12 p-8 bg-white rounded-3xl shadow-sm">
              <svg className="w-10 h-10 text-berino-mint mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl text-berino-charcoal italic mb-4">
                "Wij geloven dat een gezonde hoofdhuid de basis is voor mooi haar."
              </p>
              <p className="text-berino-sage font-medium">
                — Team Berino
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-padding bg-gradient-to-br from-berino-forest via-berino-forest to-berino-sage overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container-berino relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white mb-4">
              Klaar voor een gezonde hoofdhuid?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Plan een afspraak en ontdek welke behandeling het beste bij jou past.
              Ons team staat voor je klaar.
            </p>

            <button
              onClick={handleBookingClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-berino-forest font-semibold text-lg rounded-xl hover:bg-berino-cream transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Plan direct een afspraak
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
