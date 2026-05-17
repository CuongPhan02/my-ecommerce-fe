import Link from 'next/link'
import { MegaMenuConfig } from '~/features/admin/menu/types'

interface ShopDropdownProps {
  config: MegaMenuConfig | null
}

const ShopDropdown = ({ config }: ShopDropdownProps) => {
  if (!config) return null

  return (
    <div className='w-full bg-black text-white border-t border-b border-white/20 py-10 px-8 lg:px-16 shadow-2xl'>
      <div className='flex container-layout'>
        {/* Categories (Left Columns) */}
        <div className='w-full grid grid-cols-4 gap-8'>
          {/* Column 1: Categories */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-bold text-xs uppercase tracking-wide mb-2'>
              Categories
            </h3>
            {config.categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className='text-sm hover:underline transition-colors'
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Column 2: Collections */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-bold text-xs uppercase tracking-wide mb-2'>
              Collections
            </h3>
            {config.collections?.map((col) => (
              <Link
                key={col.id}
                href={`/collection/${col.slug}`}
                className='text-sm hover:underline transition-colors'
              >
                {col.name}
              </Link>
            ))}
          </div>

          {/* Column 3: Attributes */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-bold text-xs uppercase tracking-wide mb-2'>
              Attributes
            </h3>
            {config.attributes?.map((attr) => (
              <div key={attr.id} className='flex flex-col space-y-2'>
                <span className='text-sm font-semibold'>{attr.name}</span>
                {/* Future: Render attribute values if needed */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopDropdown
