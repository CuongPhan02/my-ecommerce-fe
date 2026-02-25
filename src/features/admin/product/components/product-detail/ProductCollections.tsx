'use client'

import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Label } from '~/components/ui/core/label'

const ProductCollections = () => {
  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>
        <CardTitle className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
          Product Collections
        </CardTitle>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='space-y-5'>
          <div className='flex items-center space-x-3'>
            <Checkbox id='coll-1' defaultChecked={true} />
            <Label
              htmlFor='coll-1'
              className='text-base font-medium text-gray-700 dark:text-gray-200 cursor-pointer'
            >
              Top Picks On Clothing
            </Label>
          </div>

          <div className='flex items-center space-x-3'>
            <Checkbox id='coll-2' />
            <Label
              htmlFor='coll-2'
              className='text-base font-medium text-gray-700 dark:text-gray-200 cursor-pointer'
            >
              Trending Offers
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter className='border-t border-gray-200 dark:border-gray-700 px-6'>
        <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
          You can create new collection or manage existing collections from
          <Link href='#' className='font-medium text-primary hover:underline'>
            Product Collections Module
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default ProductCollections
