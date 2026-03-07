'use client'

export default function OverOnsPage() {
  const handleBookingClick = () => {
    window.location.href = 'https://www.berino.nl/afspraak-maken/'
  }

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Onderdeel van Berino – The Art of Beauty
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
              Over Haar & Hoofdhuid Specialist
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Een uniek beautyconcept waar ontspanning, expertise en persoonlijke aandacht samenkomen.
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

      {/* Kernwaarden Section */}
      <section className="section-padding bg-berino-offwhite">
        <div className="container-berino">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Kaart 1 - Expertise */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-berino-mint/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-berino-mint/30 transition-colors" />
              <div className="relative">
                <div className="w-14 h-14 bg-berino-forest/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-berino-forest group-hover:scale-110 transition-all duration-300">
                  <svg className="w-7 h-7 text-berino-forest group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                  Expertise
                </h3>
                <p className="text-berino-gray leading-relaxed">
                  Bij Berino analyseren, behandelen en begeleiden we haar- en hoofdhuidproblemen.
                </p>
              </div>
            </div>

            {/* Kaart 2 - Behandelingen */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-berino-sage/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-berino-sage/30 transition-colors" />
              <div className="relative">
                <div className="w-14 h-14 bg-berino-forest/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-berino-forest group-hover:scale-110 transition-all duration-300">
                  <svg className="w-7 h-7 text-berino-forest group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                  Behandelingen
                </h3>
                <p className="text-berino-gray leading-relaxed">
                  Detox- & zuurstof-spa behandelingen voor verbetering van de hoofdhuid en het haar.
                </p>
              </div>
            </div>

            {/* Kaart 3 - Kwaliteit */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-berino-cream/40 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-berino-cream/60 transition-colors" />
              <div className="relative">
                <div className="w-14 h-14 bg-berino-forest/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-berino-forest group-hover:scale-110 transition-all duration-300">
                  <svg className="w-7 h-7 text-berino-forest group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                  Kwaliteit
                </h3>
                <p className="text-berino-gray leading-relaxed">
                  Wij werken uitsluitend met hoogwaardige, zorgvuldig geselecteerde producten en geavanceerde technieken voor maximale kwaliteit en zichtbare resultaten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Over Berino Section */}
      <section className="section-padding bg-white">
        <div className="container-berino">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Tekst links */}
              <div>
                <span className="inline-block text-berino-sage font-medium text-sm uppercase tracking-wider mb-4">
                  Ons verhaal
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-berino-charcoal mb-6">
                  Alles onder één dak
                </h2>
                <div className="space-y-4 text-berino-gray leading-relaxed">
                  <p>
Bij Berino staan persoonlijke aandacht, deskundigheid en resultaat voorop. Wij zijn gespecialiseerd in hoofdhuid- en haarproblemen, zoals dunner haar, haaruitval en bieden daarnaast professionele haarwerken. Met onze kennis, hoogwaardige producten en behandelingen helpen we je haar weer gezond, vol en stralend te maken.
                  </p>
                  <p>
                    Samen met ons ervaren team doen wij er alles aan om jou te laten genieten
                    van onze expertise op het gebied van haar en hoofdhuid. Persoonlijke
                    aandacht en kwaliteit staan bij ons altijd centraal.
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
                        <h4 className="font-semibold text-berino-charcoal mb-1">Gezichtsbehandelingen</h4>
                        <p className="text-sm text-berino-gray">Professionele huidverzorging op maat</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-berino-forest rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-berino-charcoal mb-1">Haarverzorging</h4>
                        <p className="text-sm text-berino-gray">Van knipbeurt tot kleuring en styling</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-berino-forest rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-berino-charcoal mb-1">Massages</h4>
                        <p className="text-sm text-berino-gray">Ontspanning voor lichaam en geest</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-berino-forest rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-berino-charcoal mb-1">Nagelverzorging</h4>
                        <p className="text-sm text-berino-gray">Pedicure en manicure behandelingen</p>
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
              De ervaring
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-berino-charcoal mb-6">
              Een moment voor jezelf
            </h2>
            <div className="space-y-4 text-lg text-berino-gray leading-relaxed">
              <p>
                Terwijl jij geniet van je behandeling, kun je ontspannen met een hapje en
                een drankje. Laat je inspireren, kom tot rust en voel je vooral thuis.
              </p>
              <p>
                Wij werken uitsluitend met hoogwaardige verzorgings- en kleurproducten
                en bieden diverse mooie merken aan — elk met hun eigen verhaal en
                specialisatie. Zo garanderen we kwaliteit én een behandeling die echt bij
                jou past.
              </p>
            </div>

            {/* Quote */}
            <div className="mt-12 p-8 bg-white rounded-3xl shadow-sm">
              <svg className="w-10 h-10 text-berino-mint mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl text-berino-charcoal italic mb-4">
                "Persoonlijke aandacht en kwaliteit staan bij ons altijd centraal."
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
              Gun jezelf een moment van pure verzorging
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Ons team staat voor je klaar om je te laten stralen — van hoofdhuid tot
              haarpunten en alles daar tussenin.
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
