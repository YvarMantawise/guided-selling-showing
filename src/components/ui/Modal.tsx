'use client'

// src/components/ui/Modal.tsx
// ============================================
// Modal voor AI Chat interface
// ============================================

import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Add/remove event listeners and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  }

  if (!isOpen) return null

  // Render in portal
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-berino-charcoal/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className={`
          bg-white rounded-3xl shadow-modal
          w-full ${sizeClasses[size]}
          animate-slide-up
        `}
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 2rem)',
          overflow: 'hidden',
        }}
      >
        {/* Header - fixed at top */}
        {(title || showCloseButton) && (
          <div 
            className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-berino-mint/30"
            style={{ flexShrink: 0 }}
          >
            {title && (
              <h2
                id="modal-title"
                className="font-heading text-lg sm:text-xl font-semibold text-berino-charcoal"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 -m-2 rounded-lg text-berino-gray hover:text-berino-charcoal hover:bg-berino-mint/30 transition-colors ml-auto"
                aria-label="Sluiten"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content - scrollable */}
        <div 
          style={{ 
            flex: '1 1 auto',
            overflowY: 'auto',
            minHeight: 0,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
