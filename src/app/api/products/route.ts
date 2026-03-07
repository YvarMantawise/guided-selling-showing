// src/app/api/products/route.ts
// ============================================
// API endpoint to fetch products by handles
// Used by advies page to get recommended products
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { getProductsByHandles } from '@/lib/shopify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { handles } = body

    if (!handles || !Array.isArray(handles) || handles.length === 0) {
      return NextResponse.json(
        { error: 'Handles array is required' },
        { status: 400 }
      )
    }

    const limitedHandles = handles.slice(0, 10)
    const products = await getProductsByHandles(limitedHandles)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
