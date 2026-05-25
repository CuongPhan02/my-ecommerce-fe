'use client'

import { Plus, Trash, UploadCloud } from 'lucide-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Label } from '~/components/ui/core/label'
import { Separator } from '~/components/ui/core/separator'
import { MediaPickerModal } from '~/features/admin/media/components'
import { MediaItem } from '~/features/admin/media/types'
import { cn } from '~/lib/utils'
import { ProductSchemaType } from '../../product.validate'

const ProductImages = () => {
  const { setValue, watch } = useFormContext<ProductSchemaType>()

  const thumbnailImage = watch('thumbnail')
  const galleryImages = watch('media') || []

  const handleSelectThumbnailImage = (items: MediaItem[]) => {
    if (items.length > 0) {
      setValue('thumbnailId', items[0].id)
      setValue('thumbnail', items[0])
    }
  }

  const handleRemoveThumbnailImage = () => {
    setValue('thumbnailId', null)
    setValue('thumbnail', null)
  }

  const handleSelectGalleryImages = (items: MediaItem[]) => {
    if (items.length > 0) {
      const currentMediaIds = watch('mediaIds') || []
      const currentMedia = watch('media') || []

      const newMediaIds = [...currentMediaIds]
      const newMedia = [...currentMedia]

      items.forEach((item) => {
        if (!newMediaIds.includes(item.id)) {
          newMediaIds.push(item.id)
          newMedia.push(item)
        }
      })

      setValue('mediaIds', newMediaIds)
      setValue('media', newMedia)
    }
  }

  const handleRemoveGalleryImage = (id: string) => {
    const currentMediaIds = watch('mediaIds') || []
    const currentMedia = watch('media') || []

    const newMediaIds = currentMediaIds.filter((mediaId) => mediaId !== id)
    const newMedia = currentMedia.filter((item) => item.id !== id)

    setValue('mediaIds', newMediaIds)
    setValue('media', newMedia)
  }

  return (
    <Card className='bg-muted shadow-none'>
      <CardHeader className='border-b font-bold'>Hình ảnh sản phẩm</CardHeader>
      <CardContent className='space-y-6 pt-6'>
        {/* Main Thumbnail Section */}
        <div className='flex flex-col gap-3'>
          <div>
            <Label className='text-lg font-medium text-gray-700 dark:text-gray-200'>
              Ảnh đại diện sản phẩm
            </Label>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Hình ảnh chính được hiển thị trong danh sách cửa hàng.
            </p>
          </div>

          <div className='flex flex-col items-start gap-3'>
            {thumbnailImage ? (
              <div className='relative w-40 h-40 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:border-primary transition-colors'>
                {thumbnailImage.fileType === 'VIDEO' ? (
                  <video
                    src={thumbnailImage.url}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <img
                    src={thumbnailImage.url}
                    alt={thumbnailImage.altText || 'Thumbnail'}
                    className='w-full h-full object-cover'
                  />
                )}
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  onClick={handleRemoveThumbnailImage}
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <EnhancedImagePlaceholder
                text='Chọn ảnh đại diện'
                size='md'
                className='w-40 h-40'
              />
            )}

            <MediaPickerModal
              onSelect={handleSelectThumbnailImage}
              trigger={
                <Button
                  variant={'ghost'}
                  className='text-sm font-medium text-primary transition-colors'
                >
                  {thumbnailImage ? 'Thay đổi hình ảnh' : 'Chọn tệp'}
                </Button>
              }
            />
          </div>
        </div>

        <Separator />

        {/* Gallery Selection Section */}
        <div className='flex flex-col gap-3'>
          <div>
            <Label className='text-lg font-medium text-gray-700 dark:text-gray-200'>
              Bộ sưu tập hình ảnh
            </Label>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Các hình ảnh bổ sung cho trang chi tiết sản phẩm.
            </p>
          </div>

          <div className='flex flex-wrap gap-4'>
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className='relative w-32 h-32 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:border-primary transition-all'
              >
                {image.fileType === 'VIDEO' ? (
                  <video
                    src={image.url}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <img
                    src={image.url}
                    alt={image.altText || 'Gallery Image'}
                    className='w-full h-full object-cover'
                  />
                )}
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  onClick={() => handleRemoveGalleryImage(image.id)}
                >
                  <Trash className='h-3.5 w-3.5' />
                </Button>
              </div>
            ))}

            <MediaPickerModal
              multiple
              onSelect={handleSelectGalleryImages}
              trigger={
                <div className='flex flex-col items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-muted dark:hover:bg-muted/80 transition-all cursor-pointer text-gray-400 hover:text-primary hover:border-primary'>
                  <Plus className='h-8 w-8 mb-1' />
                  <span className='text-xs font-medium'>Thêm ảnh</span>
                </div>
              }
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
  text = 'Kéo & Thả hoặc Chọn tệp',
  icon = <UploadCloud className='h-8 w-8 text-gray-400' />,
  size = 'md',
  className,
}: EnhancedImagePlaceholderProps) => {
  const heightWidth =
    size === 'sm' ? 'h-24 w-24' : size === 'lg' ? 'h-48 w-48' : 'h-36 w-full'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 text-gray-500 transition-colors hover:border-primary dark:bg-muted dark:hover:border-primary',
        heightWidth,
        className,
      )}
    >
      {icon}
      <span className={cn('mt-2 font-medium text-center px-2', textSize)}>
        {text}
      </span>
    </div>
  )
}
