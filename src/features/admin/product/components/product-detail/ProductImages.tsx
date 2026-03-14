'use client'

import { Trash, UploadCloud } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '~/components/ui/core/button'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Label } from '~/components/ui/core/label'
import { MediaPickerModal, MediaItem } from '~/features/admin/media'
import { cn } from '~/lib/utils'

const ProductImages = () => {
  const [thumbnailImage, setThumbnailImage] = useState<MediaItem[] | []>([])
  const [galleryImages, setGalleryImages] = useState<MediaItem[] | []>([])
  const handleSelectThumbnailImage = (items: MediaItem[]) => {
    console.log('Selected Gallery Items:', items)
    setThumbnailImage(items)
  }
  const handleSelectThumbnailGallary = (items: MediaItem[]) => {
    console.log('Selected Gallery Items:', items)
    setGalleryImages(items)
  }

  const handleRemoveThumbnailImageItem = (id: string) => {
    setThumbnailImage(thumbnailImage?.filter((item) => item.id !== id) || null)
  }
  const handleRemoveGalleryImageItem = (id: string) => {
    setGalleryImages(galleryImages?.filter((item) => item.id !== id) || null)
  }
  return (
    <>
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
              {thumbnailImage?.length > 0 ? (
                <div className='grid grid-cols-4 gap-3 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 text-gray-500 transition-colors hover:border-primary dark:bg-muted dark:hover:border-primary'>
                  {thumbnailImage.map((item) => {
                    return (
                      <div key={item.id} className='aspect-square  relative'>
                        <img
                          src={item.url}
                          alt={item.url}
                          className='w-full object-cover h-full rounded-lg'
                        />
                        <Button
                          variant={'ghost'}
                          className='text-base font-medium text-primary transition-colors mx-auto absolute bottom-0 right-0 '
                          onClick={() =>
                            handleRemoveThumbnailImageItem(item.id)
                          }
                        >
                          <Trash />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EnhancedImagePlaceholder
                  text='Choose Thumbnail'
                  icon={<UploadCloud className='h-8 w-8 text-gray-400' />}
                />
              )}

              <MediaPickerModal
                onSelect={handleSelectThumbnailImage}
                trigger={
                  <Button
                    variant={'ghost'}
                    className='text-base font-medium text-primary transition-colors mx-auto'
                  >
                    Choose File
                  </Button>
                }
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
              {galleryImages?.length > 0 ? (
                <div className='grid grid-cols-4 gap-3 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 text-gray-500 transition-colors hover:border-primary dark:bg-muted dark:hover:border-primary'>
                  {galleryImages.map((item) => {
                    return (
                      <div key={item.id} className='aspect-square '>
                        <img
                          src={item.url}
                          alt={item.url}
                          className='w-full object-cover h-full rounded-lg'
                        />
                        <Button
                          variant={'ghost'}
                          className='text-base font-medium text-primary transition-colors mx-auto absolute bottom-0 right-0 '
                          onClick={() => handleRemoveGalleryImageItem(item.id)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EnhancedImagePlaceholder
                  text='Choose Gallery Files'
                  icon={<UploadCloud className='h-8 w-8 text-gray-400' />}
                />
              )}

              <MediaPickerModal
                onSelect={handleSelectThumbnailGallary}
                trigger={
                  <Button
                    variant={'ghost'}
                    className='text-base font-medium text-primary transition-colors mx-auto'
                  >
                    Choose Files
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
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
