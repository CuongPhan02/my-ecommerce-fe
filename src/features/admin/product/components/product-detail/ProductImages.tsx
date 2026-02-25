'use client'

import { ImageIcon, UploadCloud } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { cn } from '~/lib/utils'

const ProductImages = () => {
  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>Product Images</CardHeader>
      <CardContent className='space-y-5'>
        <div className='flex flex-col gap-3'>
          <div>
            <Label className='text-lg font-medium text-gray-700 dark:text-gray-200'>
              Thumbnail Image
            </Label>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Main image for the product. (Recommended: 385x380 px)
            </p>
          </div>

          <div className='flex flex-col items-start gap-3'>
            <EnhancedImagePlaceholder
              text='Drag & Drop or Choose Thumbnail'
              icon={<ImageIcon className='h-8 w-8 text-gray-400' />}
            />
            <Label
              htmlFor='thumbnail-upload-enhanced'
              className='cursor-pointer text-base font-medium text-primary transition-colors mx-auto'
            >
              Choose File
            </Label>
            <Input
              id='thumbnail-upload-enhanced'
              type='file'
              className='hidden'
            />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <div>
            <Label className='text-lg font-medium text-gray-700 dark:text-gray-200'>
              Gallery Images
            </Label>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Additional images for the product. (Recommended: 624x624 px)
            </p>
          </div>

          <div className='flex flex-col items-start gap-3'>
            <EnhancedImagePlaceholder
              text='Drag & Drop or Choose Gallery Files'
              icon={<ImageIcon className='h-8 w-8 text-gray-400' />}
            />
            <Label
              htmlFor='gallery-upload-enhanced'
              className='cursor-pointer text-base font-medium text-primary transition-colors mx-auto'
            >
              Choose Files
            </Label>
            <Input
              id='gallery-upload-enhanced'
              type='file'
              multiple
              className='hidden'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductImages

interface EnhancedImagePlaceholderProps {
  text?: string
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const EnhancedImagePlaceholder = ({
  text = 'Drag & Drop or Choose File',
  icon = <UploadCloud className='h-8 w-8 text-gray-400' />,
  size = 'md',
  className,
}: EnhancedImagePlaceholderProps) => {
  const heightWidth =
    size === 'sm' ? 'h-24 w-24' : size === 'lg' ? 'h-48 w-' : 'h-36 w-full'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
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
  )
}
