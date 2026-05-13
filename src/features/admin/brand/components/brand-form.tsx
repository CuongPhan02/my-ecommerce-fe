'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Switch } from '~/components/ui/core/switch'
import { brandSchema, BrandSchemaType } from '../brand.validate'
import { _brandService } from '../brand.query'
import { generateRandomId, generateSlug } from '~/lib/utils'
import { toast } from 'react-toastify'

interface BrandFormProps {
  brandId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
}

const BrandForm = ({ brandId, onSuccess, onCancel }: BrandFormProps) => {
  const isEdit = !!brandId

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    getValues,
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

  useEffect(() => {
    if (brandDetail?.result) {
      const { name, slug, logoUrl, isActive } = brandDetail.result
      reset({
        name,
        slug,
        logoUrl: logoUrl || null,
        isActive: isActive ?? true,
      })
    } else {
      reset({
        name: '',
        slug: '',
        logoUrl: null,
        isActive: true,
      })
    }
  }, [brandDetail, reset, brandId])

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
      onSuccess?.()
    } catch (error) {
      toast.error(`Không thể ${isEdit ? 'cập nhật' : 'tạo'} thương hiệu`)
    }
  }

  return (
    <Card className='bg-muted shadow-none h-fit'>
      <CardHeader>
        <CardTitle>{isEdit ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
              <p className='text-xs text-destructive'>
                {String(errors.name.message)}
              </p>
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
              <p className='text-xs text-destructive'>
                {String(errors.slug.message)}
              </p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='logoUrl'>Đường dẫn Logo (Tùy chọn)</Label>
            <Input
              id='logoUrl'
              {...register('logoUrl')}
              placeholder='https://...'
              className='bg-white'
            />
          </div>
          <div className='flex items-center space-x-2 py-2'>
            <Switch
              id='isActive'
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor='isActive'>Trạng thái hoạt động</Label>
          </div>
          <div className='flex gap-2 pt-2'>
            <Button type='submit' className='flex-1' disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? 'Đang cập nhật...'
                  : 'Đang tạo...'
                : isEdit
                  ? 'Cập nhật thương hiệu'
                  : 'Tạo thương hiệu'}
            </Button>
            {isEdit && (
              <Button type='button' variant='outline' onClick={onCancel}>
                Hủy
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default BrandForm
