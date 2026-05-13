'use client'

import React, { useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { categorySchema, CategorySchemaType } from '../category.validate'
import { _categoryService } from '../category.query'
import { generateRandomId, generateSlug } from '~/lib/utils'
import { toast } from 'react-toastify'
import { useMemo } from 'react'

interface AddCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId?: string | null
}

const AddCategoryModal = ({
  open,
  onOpenChange,
  categoryId,
}: AddCategoryModalProps) => {
  const isEdit = !!categoryId

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parentId: null,
    },
  })

  const { data: categoriesData } = _categoryService.useCategories()
  const { data: categoryDetail } = _categoryService.useCategory(
    categoryId || '',
  )
  const createCategoryMutation = _categoryService.useCategoryCreate()
  const updateCategoryMutation = _categoryService.useCategoryUpdate()

  useEffect(() => {
    if (categoryDetail?.result) {
      const { name, slug, parentId } = categoryDetail.result
      reset({
        name,
        slug,
        parentId: parentId || null,
      })
    } else if (!open) {
      reset({
        name: '',
        slug: '',
        parentId: null,
      })
    }
  }, [categoryDetail, reset, open])

  const name = watch('name')
  const randomId = useMemo(() => generateRandomId(), [])

  useEffect(() => {
    if (name && !isEdit) {
      setValue('slug', generateSlug(name, randomId), { shouldValidate: true })
    }
  }, [name, setValue, isEdit, randomId])

  const onSubmit = async (data: CategorySchemaType) => {
    try {
      if (isEdit && categoryId) {
        await updateCategoryMutation.mutateAsync({
          id: categoryId,
          payload: data,
        })
        toast.success('Cập nhật danh mục thành công')
      } else {
        await createCategoryMutation.mutateAsync(data)
        toast.success('Tạo danh mục thành công')
      }
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(`Không thể ${isEdit ? 'cập nhật' : 'tạo'} danh mục`)
    }
  }

  const categories = categoriesData?.result || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Tên</Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Điện tử, Quần áo...'
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className='text-xs text-destructive'>{errors.name.message}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='slug'>Đường dẫn (Slug)</Label>
            <Input
              id='slug'
              {...register('slug')}
              placeholder='dien-tu-quan-ao'
              aria-invalid={!!errors.slug}
            />
            {errors.slug && (
              <p className='text-xs text-destructive'>{errors.slug.message}</p>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='parentId'>Danh mục cha</Label>
            <Select
              onValueChange={(value) =>
                setValue('parentId', value === 'none' ? null : value)
              }
              defaultValue='none'
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn danh mục cha' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>Không có (Gốc)</SelectItem>
                {categories?.data?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? 'Đang cập nhật...'
                  : 'Đang tạo...'
                : isEdit
                  ? 'Cập nhật danh mục'
                  : 'Tạo danh mục'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCategoryModal
