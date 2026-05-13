'use client'

import { Trash, UploadCloud } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Textarea } from '~/components/ui/core/textarea'
import { MediaPickerModal } from '~/features/admin/media/components'
import { MediaItem } from '~/features/admin/media/types'
import { cn } from '~/lib/utils'
import { ProductSchemaType } from '../../product.validate'

const SeoMetaTags = () => {
  const { register, setValue, watch } = useFormContext<ProductSchemaType>()

  const metaImage = watch('metaImage')

  const handleSelectMedia = (items: MediaItem[]) => {
    if (items.length > 0) {
      setValue('metaImageId', items[0].id)
      setValue('metaImage', items[0])
    }
  }

  const handleRemoveImage = () => {
    setValue('metaImageId', null)
    setValue('metaImage', null)
  }

  return (
    <Card className='bg-muted shadow-none'>
      <CardHeader className='border-b font-bold'>Thẻ Meta SEO</CardHeader>
      <CardContent className='space-y-5 pt-6'>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <Label>Tiêu đề Meta</Label>
          <Input
            {...register('metaTitle')}
            placeholder='Tiêu đề Meta'
            type='text'
            className='bg-white'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <Label>Mô tả Meta</Label>
          <Textarea
            {...register('metaDescription')}
            placeholder='Mô tả Meta'
            className='bg-white'
          />
        </div>

        <div className='flex flex-col gap-3'>
          <div>
            <Label className='text-lg font-medium text-gray-700 dark:text-gray-200'>
              Hình ảnh Meta
            </Label>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Hình ảnh chính cho mục đích SEO. (Khuyên dùng: 1200x630 px)
            </p>
          </div>

          <div className='flex flex-col items-start gap-3 w-full'>
            {metaImage ? (
              <div className='relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden'>
                <img
                  src={metaImage.url}
                  alt={metaImage.altText || 'Hình ảnh Meta'}
                  className='w-full h-full object-cover'
                />
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full'
                  onClick={handleRemoveImage}
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 text-gray-500 transition-colors hover:border-primary dark:bg-muted dark:hover:border-primary h-72 w-full',
                )}
              >
                <UploadCloud className='h-8 w-8 text-gray-400' />
                <span className={cn('mt-2 font-medium text-center px-2')}>
                  Chọn hình ảnh
                </span>
              </div>
            )}

            <MediaPickerModal
              onSelect={handleSelectMedia}
              trigger={
                <Button
                  variant={'ghost'}
                  className='text-base font-medium text-primary transition-colors mx-auto'
                >
                  {metaImage ? 'Thay đổi hình ảnh' : 'Chọn tệp'}
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SeoMetaTags
