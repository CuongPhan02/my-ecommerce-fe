'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Plus, FolderOpen, Image as ImageIcon, X } from 'lucide-react'
import { Switch } from '~/components/ui/core/switch'
import { brandSchema, BrandSchemaType } from '../brand.validate'
import { _brandService } from '../brand.query'
import { generateRandomId, generateSlug } from '~/lib/utils'
import { toast } from 'react-toastify'
import MediaPickerModal from '../../media/components/media-picker-modal'

interface AddBrandModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brandId?: string | null
}

const AddBrandModal = ({
  open,
  onOpenChange,
  brandId,
}: AddBrandModalProps) => {
  const isEdit = !!brandId

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      slug: '',
      logoUrl: null,
      isActive: true,
    },
  })

  const { data: brandDetail } = _brandService.useBrand(brandId || '')
  const createBrandMutation = _brandService.useBrandCreate()
  const updateBrandMutation = _brandService.useBrandUpdate()

  const logoUrl = watch('logoUrl')

  useEffect(() => {
    if (brandDetail?.result) {
      const { name, slug, logoUrl, isActive } = brandDetail.result
      reset({
        name,
        slug,
        logoUrl: logoUrl || null,
        isActive: isActive ?? true,
      })
    } else if (!open) {
      reset({
        name: '',
        slug: '',
        logoUrl: null,
        isActive: true,
      })
    }
  }, [brandDetail, reset, open])

  const name = watch('name')
  const randomId = useMemo(() => generateRandomId(), [])

  useEffect(() => {
    if (name && !isEdit) {
      setValue('slug', generateSlug(name, randomId), { shouldValidate: true })
    }
  }, [name, setValue, isEdit, randomId])

  const onSubmit = async (data: BrandSchemaType) => {
    try {
      if (isEdit && brandId) {
        await updateBrandMutation.mutateAsync({ id: brandId, payload: data })
        toast.success('Cập nhật thương hiệu thành công')
      } else {
        await createBrandMutation.mutateAsync(data)
        toast.success('Tạo thương hiệu thành công')
      }
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(`Không thể ${isEdit ? 'cập nhật' : 'tạo'} thương hiệu`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] overflow-hidden'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Tên</Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Nike, Adidas...'
              aria-invalid={!!errors.name}
              className='bg-white'
            />
            {errors.name?.message && (
              <p className='text-xs text-destructive font-medium'>{String(errors.name.message)}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='slug'>Đường dẫn (Slug)</Label>
            <Input
              id='slug'
              {...register('slug')}
              placeholder='nike-adidas'
              aria-invalid={!!errors.slug}
              className='bg-white'
            />
            {errors.slug?.message && (
              <p className='text-xs text-destructive font-medium'>{String(errors.slug.message)}</p>
            )}
          </div>
          
          <div className='grid gap-2'>
            <Label>Logo thương hiệu</Label>
            <div className='flex flex-col gap-3'>
              {logoUrl ? (
                <div className='relative group w-full aspect-[2/1] rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30'>
                  <img
                    src={logoUrl}
                    alt='Preview'
                    className='w-full h-full object-contain p-4'
                  />
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                    <MediaPickerModal
                      onSelect={(items) => setValue('logoUrl', items[0].url)}
                      trigger={
                        <Button type='button' variant='secondary' size='sm' className='h-8'>
                          Thay đổi Logo
                        </Button>
                      }
                    />
                    <Button 
                      type='button' 
                      variant='destructive' 
                      size='sm' 
                      className='h-8'
                      onClick={() => setValue('logoUrl', null)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ) : (
                <MediaPickerModal
                  onSelect={(items) => setValue('logoUrl', items[0].url)}
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
                        Nhấp để chọn logo thương hiệu
                      </span>
                    </Button>
                  }
                />
              )}
            </div>
          </div>

          <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-muted-foreground/10'>
            <div className='space-y-0.5'>
              <Label htmlFor='isActive' className='text-sm font-semibold'>Hiển thị trên cửa hàng</Label>
              <p className='text-[11px] text-muted-foreground'>Bật/tắt hiển thị thương hiệu trong danh mục cửa hàng.</p>
            </div>
            <Switch
              id='isActive'
              checked={watch('isActive')}
              onCheckedChange={(checked: boolean) => setValue('isActive', checked)}
            />
          </div>

          <DialogFooter className='gap-2 sm:gap-0 h-12 shrink-0 pt-2'>
            <Button 
              type='button' 
              variant='outline' 
              onClick={() => onOpenChange(false)}
              className='flex-1 sm:flex-none'
            >
              Hủy
            </Button>
            <Button type='submit' disabled={isSubmitting} className='flex-1 sm:flex-none min-w-[120px]'>
              {isSubmitting
                ? isEdit
                  ? 'Đang lưu...'
                  : 'Đang tạo...'
                : isEdit
                ? 'Cập nhật thương hiệu'
                : 'Tạo thương hiệu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddBrandModal
