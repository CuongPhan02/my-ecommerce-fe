'use client'

import { FormProvider, useFormContext } from 'react-hook-form'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  ProductCollections,
  ProductDescription,
  ProductDiscount,
  ProductFeatured,
  ProductImages,
  ProductInfoForm,
  ProductRefundable,
  ProductStockQuantity,
  ProductVariantForm,
  ProductWarranty,
  SeoMetaTags,
  ShippingConfiguration,
} from './components'
import { useProductHookForm } from './use-product-hook-form'
import { _productService } from './product.query'
import { ProductSchemaType } from './product.validate'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { cn } from '~/lib/utils'

interface ProductFormActionProps {
  productId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
  isModal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ProductFormAction = ({
  productId,
  onSuccess,
  onCancel,
  isModal = false,
  open,
  onOpenChange,
}: ProductFormActionProps) => {
  const { data: productDetail, isLoading } = _productService.useProduct(
    productId || '',
  )
  const form = useProductHookForm()
  const resetForm = form.reset

  useEffect(() => {
    if (productDetail?.result) {
      const product = productDetail.result
      // Map API data to ProductSchemaType
      const mappedData: Partial<ProductSchemaType> = {
        ...product,
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        discountType: (product.discountType as any) || 'FIXED',
        discountValue: product.discountValue ?? 0,
        collectionIds:
          product.collections?.map((c: any) => c.collectionId) || [],
        mediaIds: product.images?.map((img: any) => img.mediaId) || [],
        media: product.images?.map((img: any) => img.media) || [],
        options: product.options || [],
        tags: product.tags || [],
        stock: product.stock || 0,
        variants:
          product.variants?.map((v: any) => ({
            id: v.id,
            sku: v.sku,
            price: v.price || 0,
            stock: v.stockQuantity || 0,
            purchasePrice: v.purchasePrice || 0,
            attributes:
              v.attributes?.map((attr: any) => ({
                name: attr.attributeValue?.attribute?.name || '',
                value: attr.value || '',
              })) || [],
          })) || [],
      }
      form.reset(mappedData as any)
    } else if (!productId) {
      form.reset({
        type: 'SINGLE',
        isFeatured: false,
        isRefunded: false,
        hasWarranty: false,
        disableShipping: false,
        collectionIds: [],
        mediaIds: [],
        tags: [],
        variants: [],
        options: [],
      })
    }
  }, [productDetail, productId, form])

  const title = productId
    ? `Chỉnh sửa sản phẩm: ${productDetail?.result?.name || ''}`
    : 'Thêm sản phẩm mới'

  const renderForm = () => (
    <div className='flex flex-col xl:grid grid-cols-12 gap-6'>
      <div className='col-span-12 lg:col-span-8 space-y-8'>
        <div id='general'>
          <ProductInfoForm />
        </div>
        <div id='description'>
          <ProductDescription />
        </div>
        <div id='images'>
          <ProductImages />
        </div>
        <div id='variants'>
          <ProductVariantForm />
        </div>
        <div id='discount'>
          <ProductDiscount />
        </div>
        <div id='seo'>
          <SeoMetaTags />
        </div>
      </div>
      <div
        className={`col-span-12 lg:col-span-4 space-y-8 h-fit ${isModal ? '' : 'lg:sticky lg:top-20'}`}
      >
        <ActionForm
          onCancel={onCancel || resetForm}
          productId={productId}
          onSuccess={onSuccess}
          className={cn(isModal && 'hidden')}
        />
        <ShippingConfiguration />
        <ProductFeatured />
        <ProductRefundable />
        <ProductWarranty />
        <ProductStockQuantity />
        <ProductCollections />
        <ActionForm
          onCancel={onCancel || resetForm}
          productId={productId}
          onSuccess={onSuccess}
          className={cn(isModal && 'hidden')}
        />
      </div>
    </div>
  )

  // if (productId && isLoading && !productDetail) {
  //   return (
  //     <div className='flex items-center justify-center h-64'>
  //       <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
  //     </div>
  //   )
  // }

  const content = (
    <FormProvider {...form}>
      {isModal ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className='sm:max-w-full lg:max-w-[90%] xl:max-w-[90%] max-h-[95vh] overflow-hidden p-0 border shadow-2xl rounded-2xl flex flex-col'>
            <DialogTitle className='text-xl font-bold hidden'>
              Hidden
            </DialogTitle>
            {isLoading && !productDetail ? (
              <div className='flex items-center justify-center h-[95vh]'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
              </div>
            ) : (
              <>
                <DialogHeader className='px-6 py-4 border-b sticky top-0 bg-background z-10'>
                  <DialogTitle className='text-xl font-bold'>
                    {title}
                  </DialogTitle>
                </DialogHeader>
                <div className='flex-1 overflow-y-auto px-6 py-6 custom-scrollbar '>
                  {renderForm()}
                </div>
                <DialogFooter className='px-6 py-4 border-t sticky bottom-0 bg-background z-10 h-20 items-center'>
                  <ActionForm
                    onCancel={onCancel || resetForm}
                    productId={productId}
                    onSuccess={onSuccess}
                    isFooter
                  />
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Card className='border-none shadow-none bg-transparent pt-0 gap-2 uppercase'>
          <CardHeader className='px-6 pb-2'>
            <HeadingSectionAdmin title={title} />
          </CardHeader>
          <CardContent className='px-6 py-4'>{renderForm()}</CardContent>
        </Card>
      )}
    </FormProvider>
  )

  return content
}

export default ProductFormAction

const ActionForm = ({
  onCancel,
  productId,
  onSuccess,
  isFooter,
  className,
}: {
  onCancel?: () => void
  productId?: string | null
  onSuccess?: () => void
  isFooter?: boolean
  className?: string
}) => {
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormContext()

  const createMutation = _productService.useCreateProduct()
  const updateMutation = _productService.useUpdateProduct()

  const handleSubmitData = async () => {
    handleSubmit(
      async (data) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { thumbnail, media, metaImage, ...submitData } = data as any

          if (!submitData.variants) {
            submitData.variants = []
          }

          if (productId) {
            await updateMutation.mutateAsync({
              id: productId,
              data: submitData,
            })
            toast.success('Cập nhật sản phẩm thành công!')
            reset(data)
          } else {
            await createMutation.mutateAsync(submitData as any)
            toast.success('Thêm sản phẩm mới thành công!')
            reset({
              name: '',
              description: '',
              slug: '',
              categoryId: '',
              brandId: '',
              type: 'SINGLE',
              summary: '',
              tags: [],
              thumbnailId: null,
              isFeatured: false,
              isRefunded: false,
              hasWarranty: false,
              disableShipping: false,
              stock: 0,
              metaTitle: '',
              metaDescription: '',
              metaImageId: null,
              discountType: 'PERCENTAGE',
              discountValue: 0,
              discountStartDate: null,
              discountEndDate: null,
              mediaIds: [],
              collectionIds: [],
              options: [],
              variants: [],
            })
          }
          onSuccess?.()
        } catch (error) {
          console.error('Form submission failed:', error)
          toast.error(
            productId
              ? 'Cập nhật sản phẩm thất bại!'
              : 'Thêm sản phẩm mới thất bại!'
          )
        }
      },
      (errors) => {
        console.log('Form validation errors:', errors)
        toast.error('Vui lòng kiểm tra lại các thông tin bắt buộc trong biểu mẫu!')
      },
    )()
  }

  return (
    <div
      className={cn(
        !isFooter && 'p-6 bg-muted rounded-xl border shadow-sm',
        'w-full',
        className,
      )}
    >
      <div
        className={cn('flex gap-3', isFooter ? 'justify-end' : 'justify-end')}
      >
        <Button
          variant='outline'
          onClick={onCancel}
          type='button'
          className={cn(!isFooter ? 'w-full flex-1' : 'w-32')}
        >
          HỦY
        </Button>
        <Button
          onClick={handleSubmitData}
          disabled={isSubmitting}
          className={cn(!isFooter ? 'w-full flex-1' : 'w-32')}
        >
          {isSubmitting ? 'ĐANG LƯU...' : 'LƯU'}
        </Button>
      </div>
    </div>
  )
}

// tổng vốn đầu tư
