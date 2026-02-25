'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Label } from '~/components/ui/core/label'

const ProductDescription = () => {
  return (
    <Card className='bg-muted shadow-none'>
      <CardHeader>
        <CardTitle>Product Description</CardTitle>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='flex flex-col gap-3'>
          <Label>Summary</Label>
          <div className='min-h-[200px] rounded-xl border'></div>
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Description</Label>
          <div className='min-h-[200px] rounded-xl border'></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductDescription
