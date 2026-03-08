// src/app/api/shopify-search/route.ts
// ============================================
// Product zoekfunctie via Shopify Admin API.
// Wordt aangeroepen als webhook tool vanuit ElevenLabs.
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/shopify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ error: 'query is verplicht' }, { status: 400 })
    }

    const results = await searchProducts(query)
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
