import { notFound } from 'next/navigation'
import CategoriesDetail from '~/features/admin/category/components/category-detail'
import CategoryTable from '~/features/admin/category/components/category-list/category-table'

const PageAction = async ({
  params,
}: {
  params: Promise<{ action: string }>
}) => {
  const { action } = await params

  switch (action) {
    case 'create':
      return <CategoriesDetail />
    case 'list':
      return <CategoryTable />
    default:
      return notFound()
  }
}

export default PageAction
