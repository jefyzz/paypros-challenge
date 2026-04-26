import { type InputHTMLAttributes, type ReactNode, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: ReactNode
}

export default function Input({ label, error, hint, className = '', ...props }: InputProps) {
  const id = useId()
  const inputId = props.id ?? id

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium"
        style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
      >
        {label}
      </label>

      <input
        {...props}
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
      />

      {hint && !error && (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {hint}
        </p>
      )}

      {error && (
        <p className="text-xs" style={{ color: 'var(--color-danger)' }} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
