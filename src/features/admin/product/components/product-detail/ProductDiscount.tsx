'use client'
import React from 'react'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'

const discount = [
  { value: 'flat', label: 'Flat' },
  { value: 'percentage', label: 'Percentage' },
]
const ProductDiscount = () => {
  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>Product Discount</CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>Name</Label>
          </div>
          <div className='flex items-center gap-2'>
            <Input
              placeholder='0.00'
              type='number'
              required
              className='bg-white'
            />

            <Select>
              <SelectTrigger className='w-full bg-white'>
                <SelectValue placeholder='Select Categories' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Discount</SelectLabel>
                  {discount.map((item) => {
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductDiscount
