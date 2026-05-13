'use client'
import { FormProvider } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Textarea } from '~/components/ui/core/textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '~/components/ui/core/form'
import { Switch } from '~/components/ui/core/switch'

import { useCollectionHookForm } from '../use-collection-hook-form'
import { useEffect, useMemo } from 'react'
import { CollectionDetail } from '../types'
import { _collectionService } from '../collection.query'
import { Card, CardContent } from '~/components/ui/core/card'
import { Label } from '~/components/ui/core/label'
import { MediaPickerModal } from '../../media/components'
import { ImageIcon, X } from 'lucide-react'
import { generateRandomId, generateSlug } from '~/lib/utils'

interface CollectionDetailFormProps {
  collection?: CollectionDetail | null
  onSuccess: () => void
}

export const CollectionDetailForm = ({
  collection,
  onSuccess,
}: CollectionDetailFormProps) => {
  const form = useCollectionHookForm()

  const { watch, setValue } = form
  const createMutation = _collectionService.useCreateCollection()
  const updateMutation = _collectionService.useUpdateCollection()

  const imageUrl = watch('imageUrl')
  const name = watch('name')
  const randomId = useMemo(() => generateRandomId(), [])
  const isEdit = !!collection

  useEffect(() => {
    if (name && !isEdit) {
      setValue('slug', generateSlug(name, randomId), { shouldValidate: true })
    }
  }, [name, setValue, isEdit, randomId])

  useEffect(() => {
    if (collection) {
      form.reset({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        imageUrl: collection.imageUrl || '',
        isActive: collection.isActive,
      })
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        isActive: true,
      })
    }
  }, [collection, form])

  const onSubmit = async (data: any) => {
    if (collection) {
      await updateMutation.mutateAsync({ id: collection.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
    onSuccess()
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Card className='border shadow-sm'>
          <CardContent className='p-6 space-y-6'>
            <div className='grid grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bộ sưu tập</FormLabel>
                    <FormControl>
                      <Input placeholder='Mùa hè hiện đại' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đường dẫn (Slug)</FormLabel>
                    <FormControl>
                      <Input placeholder='mua-he-hien-dai' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-2'>
              <Label>Hình ảnh bộ sưu tập</Label>
              <div className='flex flex-col gap-3'>
                {imageUrl ? (
                  <div className='relative group w-full aspect-[2/1] rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30'>
                    <img
                      src={imageUrl}
                      alt='Preview'
                      className='w-full h-full object-contain p-4'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                      <MediaPickerModal
                        onSelect={(items) => setValue('imageUrl', items[0].url)}
                        trigger={
                          <Button
                            type='button'
                            variant='secondary'
                            size='sm'
                            className='h-8'
                          >
                            Thay đổi hình ảnh
                          </Button>
                        }
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='h-8'
                        onClick={() => setValue('imageUrl', null)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <MediaPickerModal
                    onSelect={(items) => setValue('imageUrl', items[0].url)}
                    trigger={
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full h-32 border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col gap-2 group'
                      >
                        <div className='p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors'>
                          <ImageIcon className='h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors' />
                        </div>
                        <span className='text-sm font-medium text-muted-foreground group-hover:text-primary'>
                          Nhấp để chọn hình ảnh bộ sưu tập
                        </span>
                      </Button>
                    }
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Kể thêm về bộ sưu tập này...'
                      className='min-h-[120px]'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Trạng thái hoạt động</FormLabel>
                    <div className='text-sm text-muted-foreground'>
                      Hiển thị bộ sưu tập này trên trang web công cộng.
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className='flex justify-end gap-3'>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'ĐANG LƯU...' : 'LƯU BỘ SƯU TẬP'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
