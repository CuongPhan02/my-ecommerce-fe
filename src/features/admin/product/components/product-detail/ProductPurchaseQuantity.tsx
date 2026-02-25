'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'

const ProductPurchaseQuantity = () => {
  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>Low stock quantity</CardHeader>
      <CardContent className='space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>Minimum Quantity</Label>
          </div>
          <Input
            placeholder='Minimum Quantity'
            type='number'
            required
            className='bg-white'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>Miximum Quantity</Label>
          </div>
          <Input
            placeholder='Miximum Quantity'
            type='number'
            required
            className='bg-white'
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductPurchaseQuantity
