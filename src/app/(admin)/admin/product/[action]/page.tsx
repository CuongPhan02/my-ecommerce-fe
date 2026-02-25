import { notFound } from 'next/navigation'
import React from 'react'
import ProductDetail from '~/features/admin/product/components/product-detail'
import ProductTable from '~/features/admin/product/components/product-list/product-table'

const PageAction = async ({
  params,
}: {
  params: Promise<{ action: string }>
}) => {
  const { action } = await params

  switch (action) {
    case 'create':
      return <ProductDetail />
    case 'list':
      return <ProductTable />
    default:
      return notFound()
  }
}

export default PageAction
