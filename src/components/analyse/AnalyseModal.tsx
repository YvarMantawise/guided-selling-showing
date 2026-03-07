'use client'

// src/components/analyse/AnalyseModal.tsx
// ============================================
// Main modal wrapper for the AI hair analysis chat
// Handles the different stages: chat -> form -> redirect
// ============================================

import { useState } from 'react'
import { Modal } from '@/components/ui'
import ChatInterface from './ChatInterface'
import GegevensForm from './GegevensForm'

interface AnalyseModalProps {
  isOpen: boolean
  onClose: () => void
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type ModalStage = 'chat' | 'form' | 'submitting'

export default function AnalyseModal({ isOpen, onClose }: AnalyseModalProps) {
  const [stage, setStage] = useState<ModalStage>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [, setIsSubmitting] = useState(false)

  // Handle closing - reset state
  const handleClose = () => {
    // Only allow closing if not submitting
    if (stage !== 'submitting') {
      onClose()
      // Reset after animation
      setTimeout(() => {
        setStage('chat')
        setMessages([])
      }, 300)
    }
  }

  // Handle moving to form stage
  const handleFinishChat = (chatMessages: ChatMessage[]) => {
    setMessages(chatMessages)
    setStage('form')
  }

  // Handle going back to chat
  const handleBackToChat = () => {
    setStage('chat')
  }

// Handle form submission
const handleFormSubmit = async (naam: string, email: string, geslacht: string, leeftijd: string) => {
  setIsSubmitting(true)
  setStage('submitting')
  
    try {
      const response = await fetch('/api/submit-analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naam,
          email,
          geslacht,
          leeftijd,
          transcript: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit analyse')
      }

      const data = await response.json()
      
      // Redirect to advice page
      window.location.href = data.redirectUrl
    } catch (error) {
      console.error('Error submitting analyse:', error)
      setIsSubmitting(false)
      setStage('form')
      // TODO: Show error toast
    }
  }

  // Get modal title based on stage
  const getTitle = () => {
    switch (stage) {
      case 'chat':
        return '🌿 Haar & Hoofdhuid Analyse'
      case 'form':
        return '📋 Bijna klaar!'
      case 'submitting':
        return '⏳ Even geduld...'
      default:
        return 'Analyse'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getTitle()}
      size="lg"
      showCloseButton={stage !== 'submitting'}
    >
      {stage === 'chat' && (
        <ChatInterface
          initialMessages={messages}
          onFinish={handleFinishChat}
        />
      )}

      {stage === 'form' && (
        <GegevensForm
          onSubmit={handleFormSubmit}
          onBack={handleBackToChat}
          isLoading={false}
        />
      )}

      {stage === 'submitting' && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-berino-mint rounded-full"></div>
            <div className="absolute inset-0 border-4 border-berino-forest border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="font-heading text-xl font-semibold text-berino-charcoal mb-2">
            Je analyse wordt voorbereid
          </h3>
          <p className="text-berino-gray">
            We sturen je door naar je persoonlijke adviespagina...
          </p>
        </div>
      )}
    </Modal>
  )
}
