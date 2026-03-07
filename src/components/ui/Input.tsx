import { forwardRef } from 'react'

// src/components/ui/Input.tsx
// ============================================
// Input field
// ============================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-berino-charcoal mb-2"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-white border rounded-xl
            text-berino-charcoal
            placeholder:text-berino-gray/50
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-berino-mint focus:border-berino-forest focus:ring-berino-forest/20'
            }
            disabled:bg-berino-offwhite disabled:cursor-not-allowed
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />
        
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-berino-gray"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
