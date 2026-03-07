// src/app/api/submit-analyse/route.ts
// ============================================
// API endpoint to submit completed analysis
// Sends data to Make.com webhook for processing
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/session-store'

const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL
const MAKE_API_KEY = process.env.MAKE_API_KEY

interface TranscriptMessage {
  role: 'user' | 'assistant'
  content: string
}

interface SubmitAnalyseRequest {
  naam: string
  email: string
  geslacht: string
  leeftijd: string
  transcript: TranscriptMessage[]
}

// Generate unique user ID
function generateUserId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 10)
  return `usr_${timestamp}${randomPart}`
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SubmitAnalyseRequest = await request.json()
    const { naam, email, geslacht, leeftijd, transcript } = body

    // Validate required fields
    if (!naam || !email || !geslacht || !leeftijd || !transcript) {
      return NextResponse.json(
        { error: 'Naam, email, geslacht, leeftijd en transcript zijn verplicht' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 }
      )
    }

    // Validate geslacht
    const geldigeGeslachten = ['man', 'vrouw', 'anders']
    if (!geldigeGeslachten.includes(geslacht)) {
      return NextResponse.json(
        { error: 'Ongeldig geslacht' },
        { status: 400 }
      )
    }

    // Validate leeftijd
    const geldigeLeeftijden = ['0-20', '21-30', '31-40', '41-50', '51-60', '60+']
    if (!geldigeLeeftijden.includes(leeftijd)) {
      return NextResponse.json(
        { error: 'Ongeldige leeftijdscategorie' },
        { status: 400 }
      )
    }

    // Validate transcript has content
    if (!Array.isArray(transcript) || transcript.length === 0) {
      return NextResponse.json(
        { error: 'Transcript mag niet leeg zijn' },
        { status: 400 }
      )
    }

    // Generate unique user ID
    const userId = generateUserId()

    // Create session BEFORE sending to webhook
    // This ensures the session exists when the user lands on the advies page
    createSession(userId, naam, email)
    console.log('Created session for user:', userId, naam)

    // Prepare webhook payload
    const webhookPayload = {
      userId,
      naam,
      email,
      geslacht,
      leeftijd,
      transcript,
      // Callback URL for Make.com to send results back
      callbackUrl: `${getBaseUrl(request)}/api/advies/${userId}`,
      // Metadata
      submittedAt: new Date().toISOString(),
      source: 'Haar & Hoofdhuid Specialist',
    }

    // Check webhook URL is configured
    if (!WEBHOOK_URL) {
      console.error('MAKE_WEBHOOK_URL not configured')
      return NextResponse.json(
        { error: 'Webhook niet geconfigureerd' },
        { status: 500 }
      )
    }

    // Check API key is configured
    if (!MAKE_API_KEY) {
      console.error('MAKE_API_KEY not configured')
      return NextResponse.json(
        { error: 'API key niet geconfigureerd' },
        { status: 500 }
      )
    }

    // Send to Make.com webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-make-apikey': MAKE_API_KEY,
      },
      body: JSON.stringify(webhookPayload),
    })

    if (!webhookResponse.ok) {
      console.error('Webhook error:', webhookResponse.status, await webhookResponse.text())
      throw new Error('Failed to send to webhook')
    }
    
    // Return success with redirect URL
    return NextResponse.json({
      success: true,
      userId,
      redirectUrl: `/advies/${userId}`,
    })

  } catch (error) {
    console.error('Submit analyse error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het versturen van je analyse' },
      { status: 500 }
    )
  }
}

// Get base URL from request
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}
