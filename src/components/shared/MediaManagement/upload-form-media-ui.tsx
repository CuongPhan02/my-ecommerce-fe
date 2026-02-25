'use client'
import { UploadCloud } from 'lucide-react'
import React from 'react'
import { cn } from '~/lib/utils'

interface EnhancedImagePlaceholderProps {
  text?: string
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const UploadFormMediaUi = ({
  text = 'Drag & Drop or Choose File',
  icon = <UploadCloud className='h-8 w-8 text-gray-400' />,
  size = 'md',
  className,
}: EnhancedImagePlaceholderProps) => {
  const heightWidth =
    size === 'sm' ? 'h-24 w-24' : size === 'lg' ? 'h-48 w-48' : 'h-36 w-full'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  return (
    <div className='flex flex-col justify-center gap-5 w-full'>
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 text-gray-500 transition-colors hover:border-primary dark:bg-muted dark:hover:border-primary',
          heightWidth,
          className
        )}
      >
        {icon}
        <span className={cn('mt-2 font-medium text-center px-2', textSize)}>
          {text}
        </span>
      </div>
      <span className='cursor-pointer text-base font-medium text-primary transition-colors mx-auto'>
        Choose Files
      </span>
    </div>
  )
}

export default UploadFormMediaUi
