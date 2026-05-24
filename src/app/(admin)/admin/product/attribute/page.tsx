import { AttributeList } from '~/features/admin/product/components/attribute'

export const metadata = {
  title: 'Quản lý thuộc tính | Admin Dashboard',
  description: 'Quản lý thuộc tính sản phẩm biến thể',
}

const AttributePage = () => {
  return (
    <div className=''>
      <AttributeList />
    </div>
  )
}

export default AttributePage
