export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Beantwoord Vragen',
      description: 'Onze AI stelt je een paar gerichte vragen over je haar en hoofdhuid. Dit duurt slechts 2 minuten.',
    },
    {
      number: '02',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      title: 'AI Analyseert',
      description: 'Onze geavanceerde AI analyseert je antwoorden en identificeert de oorzaken van je klachten.',
    },
    {
      number: '03',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      title: 'Krijg Jouw Advies',
      description: 'Ontvang een persoonlijk rapport met uitleg én product aanbevelingen die passen bij jouw situatie.',
    },
  ]

  return (
    <section className="section-padding bg-berino-offwhite">
      <div className="container-berino">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-berino-forest uppercase tracking-wider mb-3">
            Hoe het werkt
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-berino-charcoal mb-4">
            In 3 Simpele Stappen naar
            <br />
            <span className="text-gradient">Jouw Persoonlijke Advies</span>
          </h2>
          <p className="text-berino-gray text-lg">
            Geen ingewikkelde vragenlijsten, gewoon een natuurlijk gesprek met onze AI.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative group"
            >
              {/* Connector line (not on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-berino-mint to-transparent" />
              )}
              
              <div className="relative bg-white rounded-2xl p-8 shadow-subtle border border-berino-mint/30 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-berino-forest text-white rounded-xl flex items-center justify-center font-semibold text-sm shadow-button">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-berino-mint/30 rounded-2xl flex items-center justify-center text-berino-forest mb-6 transition-colors group-hover:bg-berino-forest group-hover:text-white">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-semibold text-berino-charcoal mb-3">
                  {step.title}
                </h3>
                <p className="text-berino-gray leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
