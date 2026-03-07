'use client'

// src/components/analyse/ChatMessage.tsx
// ============================================
// Individual chat message bubble component
// Supports user and assistant message styles
// ============================================

import type { ChatMessage as ChatMessageType } from './AnalyseModal'

interface ChatMessageProps {
  message: ChatMessageType
}

/**
 * Simple markdown to HTML converter for chat messages
 */
function parseMarkdown(text: string): string {
  if (!text) return ''
  
  let html = text
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold (**text**)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic (*text*)
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    // Bullet points (- item)
    .replace(/^[-•] (.+)$/gm, '<span class="flex items-start gap-2"><span class="text-berino-forest">•</span><span>$1</span></span>')
    // Line breaks
    .replace(/\n/g, '<br />')
  
  return html
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}
    >
      <div
        className={`
          max-w-[85%] px-4 py-3 rounded-2xl
          ${isUser 
            ? 'bg-berino-forest text-white rounded-br-sm' 
            : 'bg-berino-cream text-berino-charcoal border border-berino-mint/50 rounded-bl-sm'
          }
        `}
      >
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-berino-mint/30">
            <div className="w-6 h-6 rounded-full bg-berino-forest flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-berino-sage">Bertinai</span>
          </div>
        )}

        {/* Message content with markdown support for assistant */}
        {isUser ? (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <div 
            className="text-sm leading-relaxed prose-berino"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
          />
        )}

        {/* Timestamp */}
        <div className={`mt-2 text-xs ${isUser ? 'text-white/60' : 'text-berino-gray/60'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}

// Format timestamp to HH:MM
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
