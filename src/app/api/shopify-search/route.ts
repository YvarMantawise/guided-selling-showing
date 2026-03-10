// src/app/api/shopify-search/route.ts
// ============================================
// Product zoekfunctie via Shopify Admin API.
// Wordt aangeroepen als webhook tool vanuit ElevenLabs.
// Deploy check: 2026-03-10
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/shopify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    console.log('[shopify-search] Zoekopdracht ontvangen:', { query, body })

    if (!query) {
      console.warn('[shopify-search] Geen query meegegeven')
      return NextResponse.json({ error: 'query is verplicht' }, { status: 400 })
    }

    const results = await searchProducts(query)
    console.log(`[shopify-search] ${results.length} resultaten voor query "${query}":`, results.map(r => r.handle))

    return NextResponse.json({ results })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[shopify-search] Fout:', message)
    return NextResponse.json(
      { error: 'Er ging iets mis', detail: message },
      { status: 500 }
    )
  }
}
