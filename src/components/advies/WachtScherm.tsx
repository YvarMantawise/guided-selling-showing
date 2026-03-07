'use client'

// src/components/advies/WachtScherm.tsx
// ============================================
// Loading screen while AI analysis is being prepared
// Shows animated spinner and personalized message
// ============================================

interface WachtSchermProps {
  naam?: string
}

export default function WachtScherm({ naam }: WachtSchermProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-berino-mint rounded-full"></div>
          
          {/* Spinning ring */}
          <div className="absolute inset-0 border-4 border-berino-forest border-t-transparent rounded-full animate-spin"></div>
          
          {/* Inner icon */}
          <div className="absolute inset-3 bg-berino-cream rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-berino-forest animate-pulse" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" 
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="font-heading text-2xl md:text-3xl font-semibold text-berino-charcoal mb-3">
          {naam ? `Hoi ${naam}, we analyseren` : 'We analyseren'}
          <br />
          nu je resultaten...
        </h1>
        
        <p className="text-berino-gray mb-6">
          Onze AI bekijkt je antwoorden en stelt een persoonlijk advies samen.
          Dit duurt meestal 2 of 3 minuten.
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          <span 
            className="w-2 h-2 bg-berino-forest rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          ></span>
          <span 
            className="w-2 h-2 bg-berino-forest rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          ></span>
          <span 
            className="w-2 h-2 bg-berino-forest rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          ></span>
        </div>

        {/* Tip */}
        <div className="mt-10 p-4 bg-berino-mint/20 rounded-xl border border-berino-mint/30">
          <p className="text-sm text-berino-sage">
            💡 <strong>Tip:</strong> Je ontvangt je analyse ook per e-mail, 
            zodat je deze later nog eens kunt bekijken.
          </p>
        </div>
      </div>
    </div>
  )
}
