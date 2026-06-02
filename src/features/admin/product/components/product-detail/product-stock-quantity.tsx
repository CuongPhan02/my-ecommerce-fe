'use client'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { ProductSchemaType } from '../../product.validate'
import { AlertCircle } from 'lucide-react'

const ProductStockQuantity = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()
  
  const productType = watch('type')
  const variants = watch('variants') || []
  
  // Calculate total stock from variants
  const totalStock = variants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)

  // Sync the root 'stock' field with the total from variants
  useEffect(() => {
    setValue('stock', totalStock, { shouldValidate: true })
  }, [totalStock, setValue])

  return (
    <Card className='bg-muted shadow-none border-dashed border-2 border-slate-200'>
      <CardHeader className='border-b font-black uppercase tracking-widest text-xs flex flex-row items-center gap-2'>
        <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
        Tổng tồn kho hệ thống
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='flex flex-col gap-4 pt-4'>
          <div className='*:not-first:mt-2'>
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Tổng số lượng hiện có
            </Label>
          </div>
          <div className="relative">
            <Input
              value={totalStock}
              readOnly
              placeholder='0'
              type='number'
              className='bg-white font-black text-lg h-14 border-2 focus-visible:ring-0 cursor-default'
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-100 px-3 py-1 rounded-lg">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sản phẩm</span>
            </div>
          </div>
          
          <p className='text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight'>
            {productType === 'VARIANT' 
              ? 'Số lượng được tính tự động từ tổng các biến thể bên dưới.'
              : 'Số lượng được đồng bộ trực tiếp từ thông tin sản phẩm chính.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductStockQuantity
