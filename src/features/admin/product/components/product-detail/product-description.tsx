'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Label } from '~/components/ui/core/label'
import { Textarea } from '~/components/ui/core/textarea'
import { ProductSchemaType } from '../../product.validate'

const ProductDescription = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()
  return (
    <Card className='bg-muted shadow-none' id='product-description'>
      <CardHeader>
        <CardTitle>Mô tả sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='flex flex-col gap-3'>
          <Label>Tóm tắt</Label>
          <Textarea
            {...register('summary')}
            placeholder='Tóm tắt ngắn gọn về sản phẩm'
            className='min-h-[100px] bg-white'
          />
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Mô tả</Label>
          <Textarea
            {...register('description')}
            placeholder='Mô tả chi tiết sản phẩm'
            className='min-h-[200px] bg-white'
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductDescription
