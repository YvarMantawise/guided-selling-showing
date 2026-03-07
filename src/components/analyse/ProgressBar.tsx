'use client'

// src/components/analyse/ProgressBar.tsx
// ============================================
// Progress indicator for chat completion
// Shows visual progress and label text
// ============================================

interface ProgressBarProps {
  progress: number // 0-100
  label?: string
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-berino-gray">
          {label || 'Voortgang'}
        </span>
        <span className="text-xs font-semibold text-berino-forest">
          {Math.round(clampedProgress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-berino-mint/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-berino-forest to-berino-sage rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {/* Completion indicator */}
      {clampedProgress >= 100 && (
        <div className="flex items-center gap-1.5 mt-2 text-berino-forest">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-medium">Je kunt nu afronden!</span>
        </div>
      )}
    </div>
  )
}
