import BrandList from '~/features/admin/brand/components/brand-list/brand-list'

export const metadata = {
  title: 'Brand Management | Admin Dashboard',
  description: 'Manage product brands',
}

const BrandPage = () => {
  return (
    <div className=''>
      <BrandList />
    </div>
  )
}

export default BrandPage
