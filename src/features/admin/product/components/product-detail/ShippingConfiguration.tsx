'use client'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'

const ShippingConfiguration = () => {
  return (
    <Card className='bg-muted shadow-none col-span-5 '>
      <CardHeader className='border-b font-bold'>
        Shipping Configuration
      </CardHeader>
      <CardContent>
        Product wise shipping cost or profile based shiping cost is disable
        Configure{' '}
        <Link href={'#'} className='text-primary dark:text-primary'>
          Shipping & Delivery
        </Link>
      </CardContent>
    </Card>
  )
}

export default ShippingConfiguration
