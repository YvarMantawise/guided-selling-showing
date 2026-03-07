'use client'

import { useRef, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useConversation } from '@elevenlabs/react'

type ConnectionStatus = 'idle' | 'requesting' | 'connecting' | 'connected' | 'error'

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!

export default function Home() {
  const router = useRouter()
  const conversationIdRef = useRef<string | null>(null)
  const shouldRedirectRef = useRef(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const clientTools = useMemo(() => ({
    conversation_complete: async () => {
      // Zet alleen de vlag — redirect gebeurt in onDisconnect
      // zodat de agent eerst zijn afsluitende zin kan afmaken
      shouldRedirectRef.current = true
    },
  }), [])

  const { status, isSpeaking, startSession, endSession } = useConversation({
    onConnect: () => setConnectionStatus('connected'),
    onDisconnect: () => {
      setConnectionStatus('idle')
      if (shouldRedirectRef.current) {
        shouldRedirectRef.current = false
        const cid = conversationIdRef.current ?? ''
        router.push(`/rapport?cid=${cid}`)
      }
    },
    onError: (message) => {
      console.error('Conversation error:', message)
      setConnectionStatus('error')
      setErrorMessage('Er ging iets mis met de verbinding. Probeer het opnieuw.')
    },
    clientTools,
  })

  const handleStart = useCallback(async () => {
    setErrorMessage(null)
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
    setConnectionStatus('idle')
  }, [endSession])

  const isConnected = status === 'connected'
  const isLoading = connectionStatus === 'requesting' || connectionStatus === 'connecting'

  return (
    <main className="min-h-screen bg-berino-offwhite flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">

        {/* Hero */}
        <div className="mb-10">
          <div className="w-20 h-20 rounded-2xl bg-berino-forest flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-berino-charcoal mb-3">
            Persoonlijk advies via AI
          </h1>
          <p className="text-berino-gray text-lg max-w-sm mx-auto">
            Vertel ons je wensen en ontvang binnen minuten een op maat gemaakt advies.
          </p>
        </div>

        {/* Mic button / status */}
        <div className="flex flex-col items-center gap-6">
          {!isConnected && !isLoading && (
            <button
              onClick={handleStart}
              className="w-28 h-28 rounded-full bg-berino-forest text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}

          {isLoading && (
            <div className="w-28 h-28 rounded-full border-4 border-berino-forest border-t-transparent animate-spin" />
          )}

          {isConnected && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-28 h-28">
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-berino-forest/25 animate-ping" />
                )}
                <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-colors ${isSpeaking ? 'bg-berino-forest' : 'bg-berino-forest/80'}`}>
                  <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
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

        {/* Steps */}
        {!isConnected && !isLoading && (
          <div className="mt-14 grid grid-cols-3 gap-6 text-center">
            {[
              { step: '1', label: 'Vertel over je situatie' },
              { step: '2', label: 'Vul je gegevens in' },
              { step: '3', label: 'Ontvang je advies' },
            ].map(({ step, label }) => (
              <div key={step}>
                <div className="w-9 h-9 rounded-full bg-berino-mint/40 text-berino-forest font-bold flex items-center justify-center mx-auto mb-2 text-sm">
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
