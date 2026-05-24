'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
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
import { Badge } from '~/components/ui/core/badge'
import { AttributeValidate, AttributeSchemaType } from '../../attribute.validate'
import { _attributeService } from '../../attribute.query'
import { toast } from 'react-toastify'

interface AddAttributeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attributeId?: string | null
}

const AddAttributeModal = ({
  open,
  onOpenChange,
  attributeId,
}: AddAttributeModalProps) => {
  const isEdit = !!attributeId
  const [nameInput, setNameInput] = useState('')
  const [valueInput, setValueInput] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AttributeSchemaType>({
    resolver: zodResolver(AttributeValidate),
    defaultValues: {
      name: '',
      values: [],
    },
  })

  const { data: attributeDetail } = _attributeService.useAttribute(
    attributeId || '',
  )
  const createAttributeMutation = _attributeService.useCreateAttribute()
  const updateAttributeMutation = _attributeService.useUpdateAttribute()

  const values = watch('values') || []

  // Load details when editing
  useEffect(() => {
    if (attributeDetail?.result) {
      const { name, values: attrValues } = attributeDetail.result
      reset({
        name,
        values: attrValues
          ? attrValues.map((v: any) => ({
              id: v.id,
              value: v.value,
              name: v.name || '',
            }))
          : [],
      })
    } else if (!open) {
      reset({
        name: '',
        values: [],
      })
      setNameInput('')
      setValueInput('')
    }
  }, [attributeDetail, reset, open])

  // Handle adding custom value tags
  const handleAddValue = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmedName = nameInput.trim()
    const trimmedValue = valueInput.trim()
    if (!trimmedValue) return

    // Default name to match value if display name is left empty
    const finalName = trimmedName || trimmedValue

    if (values.some((v) => v.value.toLowerCase() === trimmedValue.toLowerCase())) {
      toast.warn('Giá trị này đã tồn tại!')
      return
    }

    setValue('values', [...values, { value: trimmedValue, name: finalName }], {
      shouldValidate: true,
    })
    setNameInput('')
    setValueInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddValue()
    }
  }

  const handleRemoveValue = (indexToRemove: number) => {
    setValue(
      'values',
      values.filter((_, idx) => idx !== indexToRemove),
      { shouldValidate: true },
    )
  }

  const onSubmit = async (data: AttributeSchemaType) => {
    try {
      if (isEdit && attributeId) {
        await updateAttributeMutation.mutateAsync({
          id: attributeId,
          data,
        })
      } else {
        await createAttributeMutation.mutateAsync(data)
      }
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px] p-6 rounded-3xl border shadow-2xl backdrop-blur-md bg-white/95 dark:bg-slate-900/95'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100'>
            {isEdit ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 mt-4'>
          {/* Attribute Name */}
          <div className='grid gap-2'>
            <Label
              htmlFor='name'
              className='text-sm font-bold text-slate-700 dark:text-slate-300'
            >
              Tên thuộc tính
            </Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Ví dụ: Kích thước, Màu sắc, Chất liệu...'
              className='rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 transition-all font-medium py-5'
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className='text-xs text-red-500 font-medium mt-0.5'>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Add Values (Name and Value inputs) */}
          <div className='grid gap-2'>
            <Label className='text-sm font-bold text-slate-700 dark:text-slate-300'>
              Các giá trị thuộc tính
            </Label>
            <div className='grid grid-cols-2 gap-3.5'>
              <div className='space-y-1.5'>
                <span className='text-[11px] font-semibold text-slate-500'>Tên hiển thị (Tên)</span>
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder='Ví dụ: Đỏ, Size L...'
                  className='rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 transition-all font-medium'
                />
              </div>
              <div className='space-y-1.5'>
                <span className='text-[11px] font-semibold text-slate-500'>Giá trị thực tế <span className='text-red-500'>*</span></span>
                <div className='flex gap-2'>
                  <Input
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Ví dụ: #ff0000, L...'
                    className='rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 transition-all font-medium flex-1'
                  />
                  <Button
                    type='button'
                    onClick={() => handleAddValue()}
                    className='rounded-xl px-3 font-bold shrink-0'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
            {errors.values && (
              <p className='text-xs text-red-500 font-medium mt-0.5'>
                {errors.values.message}
              </p>
            )}

            {/* Display Values tags */}
            <div className='flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 min-h-[90px] items-start align-top content-start'>
              {values.length === 0 ? (
                <div className='w-full text-center text-xs text-slate-400 dark:text-slate-500 py-6 font-medium'>
                  Chưa có giá trị nào. Nhập một giá trị ở trên để bắt đầu!
                </div>
              ) : (
                values.map((val, idx) => (
                  <Badge
                    key={idx}
                    variant='secondary'
                    size='sm'
                    className='rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 py-1 pl-2.5 pr-1 gap-1 border-none shadow-sm flex items-center'
                  >
                    <span>
                      {val.name || val.value}{' '}
                      {val.name !== val.value && (
                        <span className='text-[10px] text-muted-foreground'>({val.value})</span>
                      )}
                    </span>
                    <button
                      type='button'
                      onClick={() => handleRemoveValue(idx)}
                      className='p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <DialogFooter className='pt-4 gap-2 sm:gap-0 border-t border-slate-100 dark:border-slate-800'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='rounded-xl font-bold border-slate-200 hover:bg-slate-50 dark:border-slate-800 py-5'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='rounded-xl font-bold py-5'
            >
              {isSubmitting
                ? isEdit
                  ? 'Đang cập nhật...'
                  : 'Đang tạo...'
                : isEdit
                  ? 'Lưu thay đổi'
                  : 'Thêm thuộc tính'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAttributeModal
