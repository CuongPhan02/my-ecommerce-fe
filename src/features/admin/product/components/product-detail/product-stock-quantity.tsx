'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { ProductSchemaType } from '../../product.validate'

const ProductStockQuantity = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()
  const productType = watch('type')

  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>Quản lý tồn kho</CardHeader>
      <CardContent className='space-y-5'>
        <div className='flex flex-col gap-4 pt-4'>
          <div className='*:not-first:mt-2'>
            <Label>Số lượng tồn kho</Label>
          </div>
          <Input
            {...register('stock', { valueAsNumber: true })}
            placeholder='Số lượng tồn kho'
            type='number'
            className='bg-white'
            disabled={productType === 'VARIANT'}
            error={errors.stock?.message}
          />
          {productType === 'VARIANT' && (
            <p className='text-xs text-muted-foreground'>
              Số lượng tồn kho được quản lý ở cấp độ biến thể
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductStockQuantity
