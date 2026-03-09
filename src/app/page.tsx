'use client'

import { useRef, useState, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useConversation } from '@elevenlabs/react'
import Image from 'next/image'

type ConnectionStatus = 'idle' | 'requesting' | 'connecting' | 'connected' | 'error'

interface InlineProduct {
  id: string
  title: string
  handle: string
  featuredImage: { url: string; altText: string | null } | null
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  variants: { id: string; availableForSale: boolean }[]
}

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === '1'
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN
  const conversationIdRef = useRef<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [shownProducts, setShownProducts] = useState<InlineProduct[]>([])

  // Refs to avoid stale closures in callbacks
  const connectionStatusRef = useRef<ConnectionStatus>('idle')
  const endSessionRef = useRef<(() => Promise<void>) | null>(null)
  const agentHasSpokenRef = useRef(false)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { status, isSpeaking, startSession, endSession, getId } = useConversation({
    clientTools: {
      end_call: async () => {
        console.log('[ElevenLabs] end_call tool aangeroepen door agent → endSession')
        await endSessionRef.current?.()
      },
      toon_product: async ({ handle }: { handle: string }) => {
        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ handles: [handle] }),
          })
          if (res.ok) {
            const data = await res.json()
            if (data.products?.length > 0) {
              const product = data.products[0]
              setShownProducts(prev => {
                if (prev.find(p => p.handle === handle)) return prev
                return [...prev, product]
              })
              // Notify parent page (webshop) so it can react to the product
              window.parent.postMessage({ type: 'gs-toon_product', handle, product }, '*')
            }
          }
        } catch {
          // Silently fail — don't interrupt the conversation
        }
        return 'Product wordt getoond aan de gebruiker.'
      },
    },
    onConnect: () => {
      console.log('[ElevenLabs] onConnect')
      const cid = getId()
      if (cid) conversationIdRef.current = cid
      setConnectionStatus('connected')
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] onDisconnect, connectionStatus was:', connectionStatusRef.current)
      if (connectionStatusRef.current === 'connected') {
        setConnectionStatus('idle')
        router.push(`/rapport?cid=${conversationIdRef.current ?? ''}`)
      }
    },
    onError: (message) => {
      console.error('[ElevenLabs] onError:', message)
      setConnectionStatus('error')
      setErrorMessage('Er ging iets mis met de verbinding. Probeer het opnieuw.')
    },
  })

  // Keep refs in sync with current values
  useEffect(() => {
    connectionStatusRef.current = connectionStatus
  }, [connectionStatus])

  useEffect(() => {
    endSessionRef.current = endSession
  }, [endSession])

  const handleStart = useCallback(async () => {
    setErrorMessage(null)
    setShownProducts([])
    setConnectionStatus('requesting')
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setConnectionStatus('connecting')
      const conversationId = await startSession({ agentId: AGENT_ID, connectionType: 'webrtc' })
      conversationIdRef.current = String(conversationId)
    } catch (err) {
      console.error('Failed to start conversation:', err)
      setConnectionStatus('error')
      setErrorMessage('Toegang tot je microfoon is vereist om het gesprek te starten.')
    }
  }, [startSession])

  const handleStop = useCallback(async () => {
    await endSession()
  }, [endSession])

  const isConnected = status === 'connected'
  const isLoading = connectionStatus === 'requesting' || connectionStatus === 'connecting'

  // Fallback: 6 seconden stilte nadat de agent gesproken heeft → automatisch afronden
  useEffect(() => {
    if (!isConnected) {
      agentHasSpokenRef.current = false
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      return
    }

    if (isSpeaking) {
      agentHasSpokenRef.current = true
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
    } else if (agentHasSpokenRef.current) {
      silenceTimerRef.current = setTimeout(() => {
        console.log('[ElevenLabs] 6s stilte na agent → automatisch afronden')
        endSessionRef.current?.()
      }, 6000)
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
    }
  }, [isSpeaking, isConnected])

  const formatPrice = (amount: string, currencyCode: string) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: currencyCode }).format(parseFloat(amount))

  const buildProductUrl = (handle: string) =>
    shopDomain ? `https://${shopDomain}/products/${handle}` : '#'

  const buildAddToCartUrl = (product: InlineProduct) => {
    const variant = product.variants[0]
    if (!variant || !shopDomain) return null
    const variantId = variant.id.replace('gid://shopify/ProductVariant/', '')
    return `https://${shopDomain}/cart/add?id=${variantId}&quantity=1`
  }

  return (
    <main className={`${isEmbed ? 'min-h-full py-6' : 'min-h-screen'} bg-berino-offwhite flex flex-col items-center justify-center px-4`}>
      <div className="w-full max-w-lg text-center">

        {/* Hero — only when no products shown yet */}
        {shownProducts.length === 0 && (
          <div className={isEmbed ? 'mb-5' : 'mb-10'}>
            <div className={`${isEmbed ? 'w-14 h-14 rounded-xl mb-3' : 'w-20 h-20 rounded-2xl mb-6'} bg-berino-forest flex items-center justify-center mx-auto`}>
              <svg className={`${isEmbed ? 'w-7 h-7' : 'w-10 h-10'} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h1 className={`font-heading ${isEmbed ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold text-berino-charcoal ${isEmbed ? 'mb-1' : 'mb-3'}`}>
              Persoonlijk advies via AI
            </h1>
            <p className={`text-berino-gray ${isEmbed ? 'text-sm' : 'text-lg'} max-w-sm mx-auto`}>
              Vertel ons je wensen en ontvang binnen minuten een op maat gemaakt advies.
            </p>
          </div>
        )}

        {/* Inline products shown during conversation */}
        {shownProducts.length > 0 && (
          <div className="mb-4 flex flex-col gap-3 text-left">
            {shownProducts.map(product => {
              const price = product.priceRange.minVariantPrice
              const addToCartUrl = buildAddToCartUrl(product)
              const isAvailable = product.variants.some(v => v.availableForSale)

              return (
                <div key={product.id} className="flex items-center gap-3 bg-white rounded-xl border border-berino-mint/30 p-3 shadow-sm">
                  <a
                    href={buildProductUrl(product.handle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-berino-offwhite"
                  >
                    {product.featuredImage?.url ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-berino-mint">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </a>

                  <div className="flex-1 min-w-0">
                    <a
                      href={buildProductUrl(product.handle)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="text-sm font-semibold text-berino-charcoal leading-tight line-clamp-2 hover:text-berino-forest transition-colors">
                        {product.title}
                      </p>
                    </a>
                    <p className="text-sm font-medium text-berino-forest mt-0.5">
                      {formatPrice(price.amount, price.currencyCode)}
                    </p>
                  </div>

                  {isAvailable && addToCartUrl ? (
                    <a
                      href={addToCartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-3 py-1.5 bg-berino-forest text-white text-xs font-semibold rounded-lg hover:bg-berino-sage transition-colors"
                    >
                      Toevoegen
                    </a>
                  ) : (
                    <span className="flex-shrink-0 text-xs text-berino-gray">Uitverkocht</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Mic button / status */}
        <div className="flex flex-col items-center gap-6">
          {!isConnected && !isLoading && (
            <button
              onClick={handleStart}
              className={`${isEmbed ? 'w-20 h-20' : 'w-28 h-28'} rounded-full bg-berino-forest text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center`}
            >
              <svg className={`${isEmbed ? 'w-10 h-10' : 'w-14 h-14'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}

          {isLoading && (
            <div className={`${isEmbed ? 'w-20 h-20' : 'w-28 h-28'} rounded-full border-4 border-berino-forest border-t-transparent animate-spin`} />
          )}

          {isConnected && (
            <div className="flex flex-col items-center gap-4">
              <div className={`relative ${isEmbed ? 'w-20 h-20' : 'w-28 h-28'}`}>
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-berino-forest/25 animate-ping" />
                )}
                <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-colors ${isSpeaking ? 'bg-berino-forest' : 'bg-berino-forest/80'}`}>
                  <svg className={`${isEmbed ? 'w-10 h-10' : 'w-14 h-14'} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>

              <p className="text-berino-forest font-medium text-sm">
                {isSpeaking ? 'AI is aan het woord...' : 'Luisteren...'}
              </p>

              <button
                onClick={handleStop}
                className="px-5 py-2 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition-colors text-sm"
              >
                Gesprek beëindigen
              </button>
            </div>
          )}

          {!isConnected && !isLoading && !errorMessage && (
            <p className="text-berino-gray text-sm">Klik om het gesprek te starten</p>
          )}

          {isLoading && (
            <p className="text-berino-gray text-sm">
              {connectionStatus === 'requesting' ? 'Microfoon toegang aanvragen...' : 'Verbinding maken...'}
            </p>
          )}

          {errorMessage && (
            <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-xl max-w-sm">
              <p className="text-red-600 text-sm">{errorMessage}</p>
              <button
                onClick={() => { setErrorMessage(null); setConnectionStatus('idle') }}
                className="mt-2 text-red-500 text-xs underline"
              >
                Sluiten
              </button>
            </div>
          )}
        </div>

        {/* Steps — only when no products shown and not connected */}
        {!isConnected && !isLoading && shownProducts.length === 0 && (
          <div className={`${isEmbed ? 'mt-6' : 'mt-14'} grid grid-cols-3 ${isEmbed ? 'gap-3' : 'gap-6'} text-center`}>
            {[
              { step: '1', label: 'Vertel over je situatie' },
              { step: '2', label: 'Vul je gegevens in' },
              { step: '3', label: 'Ontvang je advies' },
            ].map(({ step, label }) => (
              <div key={step}>
                <div className={`${isEmbed ? 'w-7 h-7' : 'w-9 h-9'} rounded-full bg-berino-mint/40 text-berino-forest font-bold flex items-center justify-center mx-auto mb-2 text-sm`}>
                  {step}
                </div>
                <p className="text-berino-gray text-xs leading-snug">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}
