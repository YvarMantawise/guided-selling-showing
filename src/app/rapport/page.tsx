'use client'

import { useState, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function RapportForm() {
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('cid') ?? ''

  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [geslacht, setGeslacht] = useState('')
  const [leeftijdscategorie, setLeeftijdscategorie] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/submit-rapport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naam, email, geslacht, leeftijdscategorie, conversationId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Er ging iets mis. Probeer het opnieuw.')
        return
      }

      // Open rapport in nieuwe tab (widget blijft open op de Shopify pagina)
      window.open(`/advies/${data.userId}?naam=${encodeURIComponent(naam)}`, '_blank')

      // Sluit de widget als deze pagina in een iframe draait
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'gs-close' }, '*')
      }
    } catch {
      setError('Verbindingsfout. Controleer je internet en probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-berino-offwhite flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-berino-mint/40 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-berino-charcoal mb-2">
            Geef je gegevens op
          </h1>
          <p className="text-berino-gray text-sm">
            We sturen je persoonlijke advies naar je e-mailadres.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-berino-mint/30 p-6 flex flex-col gap-5">

          <div>
            <label className="block text-sm font-medium text-berino-charcoal mb-1.5" htmlFor="naam">
              Voornaam
            </label>
            <input
              id="naam"
              type="text"
              required
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              placeholder="Jouw voornaam"
              className="w-full px-4 py-3 rounded-xl border border-berino-mint/50 bg-berino-offwhite focus:outline-none focus:ring-2 focus:ring-berino-forest/30 focus:border-berino-forest text-berino-charcoal placeholder:text-berino-gray/60 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-berino-charcoal mb-1.5" htmlFor="email">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw@email.nl"
              className="w-full px-4 py-3 rounded-xl border border-berino-mint/50 bg-berino-offwhite focus:outline-none focus:ring-2 focus:ring-berino-forest/30 focus:border-berino-forest text-berino-charcoal placeholder:text-berino-gray/60 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-berino-charcoal mb-1.5" htmlFor="geslacht">
              Geslacht
            </label>
            <select
              id="geslacht"
              required
              value={geslacht}
              onChange={(e) => setGeslacht(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-berino-mint/50 bg-berino-offwhite focus:outline-none focus:ring-2 focus:ring-berino-forest/30 focus:border-berino-forest text-berino-charcoal transition"
            >
              <option value="" disabled>Selecteer...</option>
              <option value="man">Man</option>
              <option value="vrouw">Vrouw</option>
              <option value="anders">Anders / zeg ik liever niet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-berino-charcoal mb-1.5" htmlFor="leeftijdscategorie">
              Leeftijdscategorie
            </label>
            <select
              id="leeftijdscategorie"
              required
              value={leeftijdscategorie}
              onChange={(e) => setLeeftijdscategorie(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-berino-mint/50 bg-berino-offwhite focus:outline-none focus:ring-2 focus:ring-berino-forest/30 focus:border-berino-forest text-berino-charcoal transition"
            >
              <option value="" disabled>Selecteer...</option>
              <option value="0-20">jonger dan 20</option>
              <option value="21-30">21 – 30</option>
              <option value="31-40">31 – 40</option>
              <option value="41-50">41 – 50</option>
              <option value="51-60">51 – 60</option>
              <option value="60+">ouder dan 60</option>
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-berino-forest text-white font-semibold hover:bg-berino-sage transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Rapport aanmaken...' : 'Ontvang mijn advies'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function RapportPage() {
  return (
    <Suspense fallback={null}>
      <RapportForm />
    </Suspense>
  )
}
