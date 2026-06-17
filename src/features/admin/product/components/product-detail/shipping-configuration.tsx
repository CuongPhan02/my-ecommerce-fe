'use client'
import Link from 'next/link'
import React, { useId } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Label } from '~/components/ui/core/label'
import { Switch } from '~/components/ui/core/switch'
import { ProductSchemaType } from '../../product.validate'

const ShippingConfiguration = () => {
  const id = useId()
  const { control } = useFormContext<ProductSchemaType>()

  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>
        Cấu hình vận chuyển
      </CardHeader>
      <CardContent className='p-6 space-y-5'>
        <div className='flex items-center justify-between'>
          <Label htmlFor={id}>Tắt vận chuyển</Label>
          <Controller
            control={control}
            name='disableShipping'
            render={({ field }) => (
              <Switch
                id={id}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        {/* <Link
          href='/'
          className='text-sm font-bold text-gray-500 hover:text-gray-700 underline'
        >
          Cấu hình cài đặt vận chuyển
        </Link> */}
      </CardContent>
    </Card>
  )
}

export default ShippingConfiguration
