import * as React from 'react'

import { cn } from '~/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  /** Hiển thị trạng thái lỗi (thường kết hợp với react-hook-form) */
  error?: boolean | string
  /** Text lỗi cụ thể (nếu muốn hiển thị ngay dưới input) */
  errorMessage?: string
  label?: string
}

/**
 * Input component với hỗ trợ error state
 * - Khi error = true → viền đỏ + ring đỏ
 * - Có thể truyền errorMessage để hiển thị text lỗi bên dưới
 */

function Input({
  className,
  type,
  error,
  errorMessage,
  label,
  ...props
}: InputProps) {
  const hasError = !!error || !!errorMessage
  return (
    <div className='w-full space-y-1'>
      {label ? (
        <label
          htmlFor={props.id}
          className='text-sm font-medium inline-block mb-2 ml-1'
        >
          {label}
        </label>
      ) : null}
      <input
        type={type}
        data-slot='input'
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30',
          'border-input flex min-h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none',
          'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'md:text-sm',

          // Focus style
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',

          // Error style
          hasError && [
            'border-destructive/70 dark:border-destructive/60',
            'ring-destructive/20 dark:ring-destructive/40',
            'focus-visible:border-destructive focus-visible:ring-destructive/30',
          ],

          className,
        )}
        aria-invalid={hasError ? 'true' : 'false'}
        {...props}
      />

      {errorMessage && (
        <p className='text-destructive text-sm leading-tight pl-2'>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export { Input }
