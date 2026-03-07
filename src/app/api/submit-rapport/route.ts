// src/app/api/submit-rapport/route.ts
// ============================================
// Receives the rapport form submission:
// 1. Fetches transcript from ElevenLabs API
// 2. Creates a pending session
// 3. Fires Make.com webhook with all data
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/session-store'
import { randomUUID } from 'crypto'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!
const WEBHOOK_URL = process.env.WEBHOOK_URL!
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

async function fetchTranscript(conversationId: string): Promise<string> {
  if (!conversationId) return ''

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    )

    if (!res.ok) {
      console.error(`ElevenLabs transcript fetch failed: ${res.status}`)
      return ''
    }

    const data = await res.json()

    // Build readable transcript from turns
    const turns: { role: string; message: string }[] = data.transcript ?? data.turns ?? []
    return turns
      .map((t) => `${t.role === 'agent' ? 'AI' : 'Klant'}: ${t.message}`)
      .join('\n')
  } catch (err) {
    console.error('Error fetching ElevenLabs transcript:', err)
    return ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { naam, email, geslacht, leeftijdscategorie, conversationId } = body

    console.log('[submit-rapport] Ontvangen payload:', { naam, email, geslacht, leeftijdscategorie, conversationId })

    if (!naam || !email || !geslacht || !leeftijdscategorie) {
      console.warn('[submit-rapport] Validatie mislukt: verplichte velden ontbreken')
      return NextResponse.json(
        { error: 'Naam, email, geslacht en leeftijdscategorie zijn verplicht.' },
        { status: 400 }
      )
    }

    const userId = randomUUID()
    console.log('[submit-rapport] userId aangemaakt:', userId)

    // Create a pending session so the advies page can start polling immediately
    createSession(userId, naam, email)

    // Fetch transcript from ElevenLabs (non-blocking on failure)
    console.log('[submit-rapport] Transcript ophalen voor conversationId:', conversationId)
    const transcript = await fetchTranscript(conversationId ?? '')
    console.log('[submit-rapport] Transcript lengte:', transcript.length, 'tekens')

    // Fire webhook to Make.com (do not await — fire and forget)
    if (!WEBHOOK_URL) {
      console.error('[submit-rapport] WEBHOOK_URL is niet ingesteld — webhook wordt overgeslagen')
    } else {
      const webhookPayload = {
        userId,
        naam,
        email,
        geslacht,
        leeftijdscategorie,
        conversationId: conversationId ?? '',
        transcript,
        source: 'widget',
        submittedAt: new Date().toISOString(),
      }

      console.log('[submit-rapport] Webhook versturen naar:', WEBHOOK_URL)

      try {
        const webhookRes = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(WEBHOOK_SECRET ? { secret: WEBHOOK_SECRET } : {}),
          },
          body: JSON.stringify(webhookPayload),
        })
        console.log('[submit-rapport] Webhook response status:', webhookRes.status)
        if (!webhookRes.ok) {
          const text = await webhookRes.text()
          console.error('[submit-rapport] Webhook response body:', text)
        }
      } catch (err) {
        console.error('[submit-rapport] Webhook fetch error:', err)
      }
    }

    return NextResponse.json({ userId })
  } catch (err) {
    console.error('[submit-rapport] Onverwachte fout:', err)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het opnieuw.' },
      { status: 500 }
    )
  }
}
