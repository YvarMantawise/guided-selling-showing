'use client'

// src/components/AddToCartButton.tsx
// ============================================
// Button om producten toe te voegen aan de Shopify cart
// ============================================

import { buildAddToCartUrl } from '@/lib/cart'

interface AddToCartButtonProps {
  variantId: string
  quantity?: number
  disabled?: boolean
  className?: string
}

export default function AddToCartButton({ 
  variantId, 
  quantity = 1, 
  disabled = false,
  className = ''
}: AddToCartButtonProps) {
  
  const handleAddToCart = () => {
    if (!variantId || disabled) return
    
    try {
      const url = buildAddToCartUrl(variantId, quantity)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || !variantId}
      className={`
        w-full py-4 px-8 rounded-xl font-semibold text-lg
        flex items-center justify-center gap-3
        transition-all duration-200
        ${disabled 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
          : 'bg-berino-forest text-white hover:bg-berino-forest-dark shadow-button hover:shadow-button-hover hover:-translate-y-0.5'
        }
        ${className}
      `}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      {disabled ? 'Niet beschikbaar' : 'Toevoegen aan winkelwagen'}
    </button>
  )
}
