'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { WachtScherm, AnalyseResultaat, ProductAanbevelingen } from '@/components/advies'
import { Button } from '@/components/ui'

interface AdviesResult {
  samenvatting: string
  diagnose: string[]
  aanbevolenProducten: string[]
}

interface Product {
  id: string
  title: string
  handle: string
  description: string
  featuredImage: { url: string; altText: string | null } | null
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  variants: {
    id: string
    title: string
    price: { amount: string; currencyCode: string }
    availableForSale: boolean
  }[]
}

type PageStatus = 'loading' | 'pending' | 'ready' | 'error' | 'expired' | 'timeout'

const POLLING_INTERVAL = 3000
const POLLING_TIMEOUT = 120000

export default function AdviesPage() {
  const params = useParams()
  const userId = params.userId as string

  const [status, setStatus] = useState<PageStatus>('loading')
  const [naam, setNaam] = useState<string>('')
  const [advies, setAdvies] = useState<AdviesResult | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')

  const fetchProducts = useCallback(async (handles: string[]) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handles }),
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [])

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/advies/${userId}`)
      const data = await response.json()

      if (data.naam) setNaam(data.naam)

      switch (data.status) {
        case 'pending':
          setStatus('pending')
          break
        case 'ready':
          setStatus('ready')
          setAdvies(data.advies)
          if (data.advies?.aanbevolenProducten?.length > 0) {
            await fetchProducts(data.advies.aanbevolenProducten)
          }
          break
        case 'error':
          setStatus('error')
          setErrorMessage(data.message || 'Er ging iets mis.')
          break
        case 'expired':
          setStatus('expired')
          break
        default:
          setStatus('pending')
      }

      return data.status
    } catch {
      return 'pending'
    }
  }, [userId, fetchProducts])

  useEffect(() => {
    if (!userId) return

    let pollInterval: NodeJS.Timeout
    let timeoutTimer: NodeJS.Timeout
    let isMounted = true

    const startPolling = async () => {
      const initialStatus = await checkStatus()
      if (initialStatus === 'ready' || initialStatus === 'error' || initialStatus === 'expired') return

      pollInterval = setInterval(async () => {
        if (!isMounted) return
        const currentStatus = await checkStatus()
        if (currentStatus === 'ready' || currentStatus === 'error' || currentStatus === 'expired') {
          clearInterval(pollInterval)
          clearTimeout(timeoutTimer)
        }
      }, POLLING_INTERVAL)

      timeoutTimer = setTimeout(() => {
        if (isMounted) {
          clearInterval(pollInterval)
          setStatus('timeout')
        }
      }, POLLING_TIMEOUT)
    }

    startPolling()

    return () => {
      isMounted = false
      clearInterval(pollInterval)
      clearTimeout(timeoutTimer)
    }
  }, [userId, checkStatus])

  return (
    <div className="min-h-screen bg-berino-offwhite">
      <div className="container-berino section-padding">
        {(status === 'loading' || status === 'pending') && <WachtScherm naam={naam} />}

        {status === 'ready' && advies && (
          <>
            <AnalyseResultaat
              naam={naam}
              samenvatting={advies.samenvatting}
              diagnose={advies.diagnose}
            />
            <ProductAanbevelingen products={products} />
          </>
        )}

        {status === 'error' && <ErrorState message={errorMessage} />}
        {status === 'expired' && <ExpiredState />}
        {status === 'timeout' && <TimeoutState userId={userId} />}
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-semibold text-berino-charcoal mb-3">Er ging iets mis</h1>
        <p className="text-berino-gray mb-6">{message}</p>
        <Link href="/"><Button variant="primary">Probeer opnieuw</Button></Link>
      </div>
    </div>
  )
}

function ExpiredState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-semibold text-berino-charcoal mb-3">Sessie verlopen</h1>
        <p className="text-berino-gray mb-6">Je sessie is verlopen. Start een nieuw gesprek om advies te ontvangen.</p>
        <Link href="/"><Button variant="primary">Nieuw gesprek starten</Button></Link>
      </div>
    </div>
  )
}

function TimeoutState({ userId }: { userId: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-berino-mint/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-berino-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-semibold text-berino-charcoal mb-3">Dit duurt langer dan verwacht</h1>
        <p className="text-berino-gray mb-6">
          Je rapport is nog in behandeling. Je kunt de pagina verversen of later terugkomen via je e-mail.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={() => window.location.reload()}>Pagina verversen</Button>
          <Link href="/"><Button variant="secondary">Terug naar home</Button></Link>
        </div>
        <p className="text-xs text-berino-gray mt-4">Referentie: {userId}</p>
      </div>
    </div>
  )
}
