'use client'

// src/components/analyse/GegevensForm.tsx
// ============================================
// Form to collect user name, email, gender and age
// Shown after chat is completed
// ============================================

import { useState } from 'react'
import { Button, Input } from '@/components/ui'

interface GegevensFormProps {
  onSubmit: (naam: string, email: string, geslacht: string, leeftijd: string) => void
  onBack: () => void
  isLoading: boolean
}

// Age category options
const LEEFTIJD_OPTIES = [
  { value: '', label: 'Selecteer je leeftijd' },
  { value: '0-20', label: '0-20 jaar' },
  { value: '21-30', label: '21-30 jaar' },
  { value: '31-40', label: '31-40 jaar' },
  { value: '41-50', label: '41-50 jaar' },
  { value: '51-60', label: '51-60 jaar' },
  { value: '60+', label: '60+ jaar' },
]

// Gender options
const GESLACHT_OPTIES = [
  { value: 'man', label: 'Man' },
  { value: 'vrouw', label: 'Vrouw' },
  { value: 'anders', label: 'Anders' },
]

export default function GegevensForm({ onSubmit, onBack, isLoading }: GegevensFormProps) {
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [geslacht, setGeslacht] = useState('')
  const [leeftijd, setLeeftijd] = useState('')
  const [errors, setErrors] = useState<{ naam?: string; email?: string; geslacht?: string; leeftijd?: string }>({})

  // Validate form
  const validate = (): boolean => {
    const newErrors: { naam?: string; email?: string; geslacht?: string; leeftijd?: string } = {}

    if (!naam.trim()) {
      newErrors.naam = 'Vul je naam in'
    } else if (naam.trim().length < 2) {
      newErrors.naam = 'Naam moet minimaal 2 karakters zijn'
    }

    if (!email.trim()) {
      newErrors.email = 'Vul je e-mailadres in'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Vul een geldig e-mailadres in'
    }

    if (!geslacht) {
      newErrors.geslacht = 'Selecteer je geslacht'
    }

    if (!leeftijd) {
      newErrors.leeftijd = 'Selecteer je leeftijdscategorie'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validate()) {
      onSubmit(naam.trim(), email.trim().toLowerCase(), geslacht, leeftijd)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header - more compact on mobile */}
      <div className="text-center mb-4 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-berino-mint/30 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg 
            className="w-6 h-6 sm:w-8 sm:h-8 text-berino-forest" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-semibold text-berino-charcoal mb-1 sm:mb-2">
          Je rapport is bijna klaar!
        </h3>
        <p className="text-sm sm:text-base text-berino-gray">
          Vul je gegevens in om je persoonlijke analyse te ontvangen.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Input
          label="Je naam"
          type="text"
          placeholder="Bijv. Anna"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          error={errors.naam}
          required
          disabled={isLoading}
        />

        <Input
          label="E-mailadres"
          type="email"
          placeholder="anna@voorbeeld.nl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          helperText="We sturen je analyse ook naar dit adres"
          required
          disabled={isLoading}
        />

        {/* Gender radio buttons - vertical on mobile, horizontal on larger screens */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-berino-charcoal">
            Geslacht <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {GESLACHT_OPTIES.map((optie) => (
              <label
                key={optie.value}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors
                  ${geslacht === optie.value 
                    ? 'border-berino-forest bg-berino-mint/20 text-berino-forest' 
                    : 'border-gray-200 hover:border-berino-forest/50'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="radio"
                  name="geslacht"
                  value={optie.value}
                  checked={geslacht === optie.value}
                  onChange={(e) => setGeslacht(e.target.value)}
                  disabled={isLoading}
                  className="sr-only"
                />
                <span className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${geslacht === optie.value ? 'border-berino-forest' : 'border-gray-300'}
                `}>
                  {geslacht === optie.value && (
                    <span className="w-2 h-2 rounded-full bg-berino-forest" />
                  )}
                </span>
                <span className="text-sm">{optie.label}</span>
              </label>
            ))}
          </div>
          {errors.geslacht && (
            <p className="text-sm text-red-500">{errors.geslacht}</p>
          )}
        </div>

        {/* Age dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-berino-charcoal">
            Leeftijd <span className="text-red-500">*</span>
          </label>
          <select
            value={leeftijd}
            onChange={(e) => setLeeftijd(e.target.value)}
            disabled={isLoading}
            className={`
              w-full px-4 py-2.5 rounded-lg border bg-white text-sm
              focus:outline-none focus:ring-2 focus:ring-berino-forest/20 focus:border-berino-forest
              ${errors.leeftijd ? 'border-red-500' : 'border-gray-200'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${!leeftijd ? 'text-gray-400' : 'text-berino-charcoal'}
            `}
          >
            {LEEFTIJD_OPTIES.map((optie) => (
              <option key={optie.value} value={optie.value}>
                {optie.label}
              </option>
            ))}
          </select>
          {errors.leeftijd && (
            <p className="text-sm text-red-500">{errors.leeftijd}</p>
          )}
        </div>

        {/* Privacy notice */}
        <p className="text-xs text-berino-gray">
          Door verder te gaan ga je akkoord met onze{' '}
          <a href="/privacy" className="text-berino-forest hover:underline">
            privacyverklaring
          </a>
          . We gebruiken je gegevens alleen voor je analyse.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2 sm:pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Terug
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            className="flex-1"
          >
            Ontvang mijn analyse
          </Button>
        </div>
      </form>
    </div>
  )
}
