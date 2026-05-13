import { Suspense } from 'react'
import ProductFormAction from '~/features/admin/product/product-form-action'

const ProductCreate = () => {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <ProductFormAction />
    </Suspense>
  )
}

export default ProductCreate
