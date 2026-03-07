'use client'

// src/components/advies/AnalyseResultaat.tsx
// ============================================
// Displays the AI analysis results with diagnosis
// and summary of hair/scalp condition
// ============================================

interface AnalyseResultaatProps {
  naam: string
  samenvatting: string
  diagnose: string[]
}

/**
 * Comprehensive markdown to HTML converter
 * Handles: headers, bold, italic, bullet points, horizontal rules, emojis
 */
function parseMarkdown(text: string): string {
  if (!text) return ''
  
  let html = text
    // Escape HTML first (but preserve emojis)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    
    // Remove horizontal rules (---) completely or convert to styled divider
    .replace(/^-{3,}$/gm, '<div class="my-6 border-t border-berino-mint/40"></div>')
    .replace(/^_{3,}$/gm, '<div class="my-6 border-t border-berino-mint/40"></div>')
    .replace(/^\*{3,}$/gm, '<div class="my-6 border-t border-berino-mint/40"></div>')
    
    // Headers with emoji support (📋 HEADER or ### Header)
    .replace(/^(#{1,3})\s*(.+)$/gm, (_, hashes, content) => {
      const level = hashes.length
      if (level === 1) return `<h2 class="text-xl font-semibold text-berino-charcoal mt-6 mb-3">${content}</h2>`
      if (level === 2) return `<h3 class="text-lg font-semibold text-berino-charcoal mt-5 mb-2">${content}</h3>`
      return `<h4 class="text-base font-semibold text-berino-charcoal mt-4 mb-2">${content}</h4>`
    })
    
    // Emoji headers (lines starting with emoji followed by ALL CAPS)
    .replace(/^([\u{1F300}-\u{1F9FF}])\s*([A-Z][A-Z\s\-&]+)$/gmu, 
      '<h3 class="text-lg font-semibold text-berino-charcoal mt-6 mb-3 flex items-center gap-2"><span>$1</span><span>$2</span></h3>')
    
    // Bold (**text** or __text__)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-berino-charcoal">$1</strong>')
    .replace(/__(.+?)__/g, '<strong class="font-semibold text-berino-charcoal">$1</strong>')
    
    // Italic (*text* or _text_) - but not bullet points
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em>$1</em>')
    
    // Bullet points (- item or * item or • item) with proper list styling
    .replace(/^[\s]*[-*•]\s+(.+)$/gm, '<li class="ml-4 mb-2 text-berino-charcoal flex items-start gap-2"><span class="text-berino-forest mt-1">•</span><span>$1</span></li>')
    
    // Numbered lists (1. item)
    .replace(/^[\s]*(\d+)\.\s+(.+)$/gm, '<li class="ml-4 mb-2 text-berino-charcoal flex items-start gap-2"><span class="text-berino-forest font-medium min-w-[1.5rem]">$1.</span><span>$2</span></li>')
    
    // Sub-headers (bold text followed by colon at start of line)
    .replace(/^([A-Za-z\s]+):$/gm, '<p class="font-semibold text-berino-charcoal mt-4 mb-2">$1:</p>')
    
    // Double line breaks = new paragraph
    .replace(/\n\n+/g, '</p><p class="mb-3">')
    
    // Single line breaks (but not after list items or headers)
    .replace(/(?<!<\/li>|<\/h[234]>|<\/div>|<\/p>)\n(?!<)/g, '<br />')

  // Clean up empty paragraphs
  html = html.replace(/<p class="mb-3"><\/p>/g, '')
  
  // Wrap consecutive list items in ul
  html = html.replace(/(<li[^>]*>[\s\S]*?<\/li>\s*)+/g, '<ul class="my-3">$&</ul>')
  
  // Wrap content in paragraph if it doesn't start with a block element
  if (!html.match(/^<(h[1-6]|ul|ol|div|p)/)) {
    html = `<p class="mb-3">${html}</p>`
  }
  
  // Clean up any remaining issues
  html = html
    .replace(/<p class="mb-3">\s*<(h[234]|ul|div)/g, '<$1')
    .replace(/<\/(h[234]|ul|div)>\s*<\/p>/g, '</$1>')
    .replace(/<br \/>\s*<(h[234]|ul|div)/g, '<$1')
    .replace(/<p class="mb-3">\s*<\/p>/g, '')

  return html
}

export default function AnalyseResultaat({ naam, samenvatting, diagnose }: AnalyseResultaatProps) {
  const formattedSamenvatting = parseMarkdown(samenvatting)
  
  return (
    <div className="mb-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-berino-mint/30 rounded-full mb-4">
          <svg 
            className="w-5 h-5 text-berino-forest" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-berino-forest">Analyse compleet</span>
        </div>
        
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-berino-charcoal mb-3">
          Jouw Persoonlijke Analyse
        </h1>
        <p className="text-berino-gray text-lg">
          Hoi {naam}, hier zijn de resultaten van je haar- en hoofdhuidanalyse. Scroll naar het einde van deze pagina om je aanbevolen producten te zien.
        </p>
      </div>

      {/* Diagnosis Card */}
      <div className="bg-white rounded-2xl shadow-card border border-berino-mint/30 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-forest px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
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
            <h2 className="font-heading text-xl font-semibold text-white">
              Diagnose
            </h2>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 md:p-8">
          {/* Summary with Markdown rendering */}
          <div 
            className="text-berino-charcoal leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedSamenvatting }}
          />

          {/* Diagnosis Points */}
          {diagnose && diagnose.length > 0 && (
            <div className="mt-8 pt-6 border-t border-berino-mint/30">
              <h3 className="text-sm font-semibold text-berino-charcoal uppercase tracking-wider mb-4">
                Belangrijkste Bevindingen
              </h3>
              <ul className="space-y-3">
                {diagnose.map((item, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-berino-offwhite rounded-xl"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-berino-mint rounded-full flex items-center justify-center mt-0.5">
                      <svg 
                        className="w-4 h-4 text-berino-forest" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-berino-charcoal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
