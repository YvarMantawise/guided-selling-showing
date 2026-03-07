'use client'

// src/components/analyse/ChatInterface.tsx
// ============================================
// The main chat interface for AI conversation
// Handles message display, input, and API calls
// ============================================

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import ChatMessage from './ChatMessage'
import ProgressBar from './ProgressBar'
import type { ChatMessage as ChatMessageType } from './AnalyseModal'

interface ChatInterfaceProps {
  initialMessages: ChatMessageType[]
  onFinish: (messages: ChatMessageType[]) => void
}

// Initial greeting from the AI
const INITIAL_MESSAGE: ChatMessageType = {
  id: 'initial',
  role: 'assistant',
  content: 'Welkom 💚 Dit is de Berino AI — een digitale haar- en hoofdhuidanalyse, ontwikkeld en gevoed met de kennis van de specialisten van Berino. Beantwoord een paar korte vragen en ontvang persoonlijk advies met praktische stappen voor jouw haar of hoofdhuid. Heb je na afloop nog vragen? Onze specialisten staan je graag persoonlijk te woord. Waar loop je op dit moment tegenaan?',
  timestamp: new Date(),
}

export default function ChatInterface({ initialMessages, onFinish }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>(
    initialMessages.length > 0 ? initialMessages : [INITIAL_MESSAGE]
  )
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [threadId, setThreadId] = useState<string | null>(null) // Store OpenAI thread ID
  const [canFinish, setCanFinish] = useState(false) // Unlocked when AI calls analyse_afronden

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Progress: 100% when AI signals done, otherwise animate based on message count (max 90%)
  const userMessageCount = messages.filter(m => m.role === 'user').length
  const progress = canFinish ? 100 : Math.min(userMessageCount * 8, 90)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Generate unique ID
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Send message to AI
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    setError(null)
    
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }
    
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          threadId: threadId, // Send existing threadId if available
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Store threadId for subsequent messages
      if (data.threadId && !threadId) {
        setThreadId(data.threadId)
      }

      // Unlock finish button if AI called analyse_afronden
      if (data.analyseKlaar) {
        setCanFinish(true)
      }

      // Add assistant message
      const assistantMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  // Handle finish button
  const handleFinish = () => {
    if (canFinish) {
      onFinish(messages)
    }
  }

  return (
    <div className="flex flex-col h-[500px] max-h-[70vh]">
      {/* Progress Bar */}
      <div className="px-6 py-3 border-b border-berino-mint/30 bg-berino-offwhite/50">
        <ProgressBar 
          progress={progress} 
          label={canFinish ? 'Klaar om af te ronden' : 'Analyse wordt opgebouwd...'}
        />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-berino-offwhite/30 to-white">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-berino-gray">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-berino-sage rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-berino-sage rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-berino-sage rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-sm">Even denken...</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-berino-mint/30 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type je antwoord..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-berino-offwhite border border-berino-mint/50 rounded-xl text-berino-charcoal placeholder:text-berino-gray/50 focus:outline-none focus:border-berino-forest focus:ring-2 focus:ring-berino-forest/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-3 bg-berino-forest text-white rounded-xl hover:bg-berino-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Verstuur"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>

        {/* Finish Button */}
        <div className="mt-3 flex justify-end">
          <Button
            variant={canFinish ? 'primary' : 'ghost'}
            size="sm"
            onClick={handleFinish}
            disabled={!canFinish || isLoading}
          >
            {canFinish ? 'Afronden en krijg rapport' : 'Beantwoord nog een paar vragen'}
            {canFinish && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
