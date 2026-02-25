import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import NewCategoryForm from './new-category-form'

const CategoriesDetail = () => {
  return (
    <Card>
      <CardHeader>
        <HeadingSectionAdmin title='New Category' />
      </CardHeader>
      <CardContent className='max-sm:p-2'>
        <NewCategoryForm />
      </CardContent>
    </Card>
  )
}

export default CategoriesDetail
