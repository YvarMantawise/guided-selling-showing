// src/app/api/advies/[userId]/route.ts
// ============================================
// API endpoints for advies status and callback
// GET: Check status (polling from client)
// POST: Receive results from Make.com webhook
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { 
  getSession, 
  createSession,
  updateSessionWithAdvies, 
  updateSessionWithError,
  type AdviesResult 
} from '@/lib/session-store'

const MAKE_API_KEY = process.env.MAKE_API_KEY

// GET: Check advies status (for polling)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    )
  }

  const session = getSession(userId)

  // If no session exists, create a pending one
  // This handles the case where the page loads before webhook completes
  if (!session) {
    // Extract name from query params if provided (fallback)
    const url = new URL(request.url)
    const naam = url.searchParams.get('naam') || 'Gebruiker'
    const email = url.searchParams.get('email') || ''
    
    createSession(userId, naam, email)
    
    return NextResponse.json({
      status: 'pending',
      message: 'Je analyse wordt voorbereid...',
    })
  }

  // Return based on status
  switch (session.status) {
    case 'pending':
      return NextResponse.json({
        status: 'pending',
        message: 'Je analyse wordt voorbereid...',
        naam: session.naam,
      })

    case 'ready':
      return NextResponse.json({
        status: 'ready',
        naam: session.naam,
        advies: session.advies,
      })

    case 'error':
      return NextResponse.json({
        status: 'error',
        message: session.error || 'Er ging iets mis bij het genereren van je advies.',
      })

    case 'expired':
      return NextResponse.json({
        status: 'expired',
        message: 'Je sessie is verlopen. Start een nieuwe analyse.',
      })

    default:
      return NextResponse.json({
        status: 'pending',
        message: 'Even geduld...',
      })
  }
}

// POST: Receive results from Make.com webhook
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  try {
    // Validate API key from header
    const apiKey = request.headers.get('x-make-apikey')
    
    if (MAKE_API_KEY && apiKey !== MAKE_API_KEY) {
      console.error('Invalid API key')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { advies, error, naam, email } = body

    // Check if session exists, create if not
    let session = getSession(userId)
    if (!session && naam && email) {
      session = createSession(userId, naam, email)
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Handle error from Make.com
    if (error) {
      updateSessionWithError(userId, error)
      return NextResponse.json({ 
        success: true, 
        status: 'error' 
      })
    }

    // Validate advies structure
    if (!advies || !advies.samenvatting || !advies.aanbevolenProducten) {
      return NextResponse.json(
        { error: 'Invalid advies format' },
        { status: 400 }
      )
    }

    // Update session with advies
    const adviesResult: AdviesResult = {
      samenvatting: advies.samenvatting,
      diagnose: advies.diagnose || [],
      aanbevolenProducten: advies.aanbevolenProducten || [],
    }

    updateSessionWithAdvies(userId, adviesResult)

    return NextResponse.json({ 
      success: true, 
      status: 'ready' 
    })

  } catch (err) {
    console.error('Webhook callback error:', err)
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    )
  }
}
