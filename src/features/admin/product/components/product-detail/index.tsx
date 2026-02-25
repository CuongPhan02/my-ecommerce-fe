'use client'
import React from 'react'
import { FormProvider, useFormContext } from 'react-hook-form'
import ProductInfoForm from './ProductInfoForm'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { useProductHookForm } from '../../use-product-hook-form'
import { Button } from '~/components/ui/core/button'
import ProductVariantForm from './ProductVariantForm'
import ShippingConfiguration from './ShippingConfiguration'
import ProductDiscount from './ProductDiscount'
import ProductDescription from './ProductDescription'
import ProductImages from './ProductImages'
import SeoMetaTags from './SeoMetaTags'
import ProductFeatured from './ProductFeatured'
import ProductRefundable from './ProductRefundable'
import ProductWarranty from './ProductWarranty'
import ProductStockQuantity from './ProductStockQuantity'
import ProductCollections from './ProductCollections'

const ProductDetail = () => {
  const form = useProductHookForm()
  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader>
          <HeadingSectionAdmin title='Add New Product' />
        </CardHeader>
        <CardContent className='max-sm:p-2'>
          <div className='flex flex-col xl:grid grid-cols-12 gap-5'>
            <div className='col-span-7 space-y-10'>
              <ProductInfoForm />
              <ProductVariantForm />
              <ProductDiscount />
              <ProductDescription />
              <ProductImages />
              <SeoMetaTags />
            </div>
            <div className='col-span-5 space-y-10'>
              <ShippingConfiguration />
              <ProductFeatured />
              <ProductRefundable />
              <ProductWarranty />
              <ProductStockQuantity />
              <ProductCollections />
            </div>
          </div>
        </CardContent>
      </Card>
      <ActionForm />
    </FormProvider>
  )
}

export default ProductDetail

const ActionForm = () => {
  const { handleSubmit } = useFormContext()

  const onClickSubmit = () => {
    handleSubmit((data) => {
      console.log('Submit data:', data)
    })()
  }
  return (
    <div className='min-h-[100px] py-5 w-fit  flex items-center justify-between custom-gradient dark:custom-gradient-dark fixed bottom-0 right-0 z-10'>
      <div className='flex max-md:flex-col gap-2 items-center justify-between w-full px-4 lg:px-10 '>
        <div className='flex items-center justify-center gap-3'>
          <Button variant={'outline'} className='bg-muted'>
            CANCLE
          </Button>
          <Button onClick={onClickSubmit}>SAVE</Button>
        </div>
      </div>
    </div>
  )
}
