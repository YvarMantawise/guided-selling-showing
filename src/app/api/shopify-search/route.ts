// src/app/api/shopify-search/route.ts
// ============================================
// Middleware tussen ElevenLabs HTTP tool en Shopify Storefront MCP.
// ElevenLabs kan de Shopify MCP niet direct aanroepen (transport issue),
// dus deze route proxied de aanroep server-side.
// ============================================

import { NextRequest, NextResponse } from 'next/server'

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN!
const MCP_ENDPOINT = `https://${SHOP_DOMAIN}/api/mcp`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, context } = body

    if (!query) {
      return NextResponse.json({ error: 'query is verplicht' }, { status: 400 })
    }

    const mcpResponse = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        id: 1,
        params: {
          name: 'search_shop_catalog',
          arguments: {
            query,
            context: context ?? '',
          },
        },
      }),
    })

    if (!mcpResponse.ok) {
      console.error('[shopify-search] MCP request failed:', mcpResponse.status)
      return NextResponse.json(
        { error: 'Shopify MCP niet bereikbaar' },
        { status: 502 }
      )
    }

    const mcpData = await mcpResponse.json()

    // MCP geeft resultaten terug in result.content als tekst of gestructureerde data
    const content = mcpData?.result?.content ?? []

    return NextResponse.json({ results: content })
  } catch (err) {
    console.error('[shopify-search] Fout:', err)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}
