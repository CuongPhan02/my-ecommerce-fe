import Link from 'next/link'

const MAIN_LINKS = [
  { label: 'SHOP ALL', href: '/shop' },
  { label: 'NEW IN', href: '/shop/new-in' },
  { label: 'BACK IN STOCK', href: '/shop/back-in-stock' },
  { label: 'BEST SELLERS', href: '/best-sellers' },
  { label: 'GIFT GUIDE', href: '/shop/gift-guide' },
  { label: 'ARCHIVE SALE', href: '/shop/archive-sale' },
]

const SHOP_BY_TYPE = [
  { label: 'Backpacks & Rucksacks', href: '/shop/backpacks' },
  { label: 'Holdalls & Duffel Bags', href: '/shop/holdalls' },
  { label: 'Tote & Crossbody Bags', href: '/shop/tote-bags' },
  { label: 'Luggage', href: '/shop/luggage' },
  { label: 'Accessories', href: '/shop/accessories' },
]

const SHOP_BY_ACTIVITY = [
  { label: 'Everyday', href: '/shop/everyday' },
  { label: 'Commuting & Work', href: '/shop/commuting' },
  { label: 'Travel', href: '/shop/travel' },
  { label: 'Gym & Sport', href: '/shop/gym' },
  { label: 'Festival', href: '/shop/festival' },
]

const SHOP_BY_FEATURE = [
  { label: 'Bags under 20L', href: '/shop/under-20l' },
  { label: '20L Bags', href: '/shop/20l' },
  { label: '30L Bags', href: '/shop/30l' },
  { label: '40L Bags', href: '/shop/40l' },
  { label: 'Laptop Compartment', href: '/shop/laptop' },
  { label: 'Weatherproof', href: '/shop/weatherproof' },
]

const SHOP_BY_COLOUR = [
  { label: 'Black', hex: '#000000' },
  { label: 'Blue', hex: '#4B6A8E' },
  { label: 'Green', hex: '#5D6A52' },
  { label: 'Grey', hex: '#B2B2B2' },
  { label: 'Sand', hex: '#D2C8B8' },
  { label: 'White', hex: '#FFFFFF', border: true },
  { label: 'Red', hex: '#7A1F1F' },
  { label: 'Yellow', hex: '#FFC82E' },
  { label: 'Orange', hex: '#D76A3D' },
  { label: 'Volt', hex: '#DFFF00', split: true },
]

const ShopDropdown = () => {
  return (
    <div className='w-full bg-black text-white border-t border-b border-white/20 py-10 px-8 lg:px-16 shadow-2xl'>
      <div className='flex container-layout'>
        {/* Main Links (Left Column) */}
        <div className='w-1/5 flex flex-col space-y-6'>
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className='font-extrabold text-sm hover:text-neutral-300 transition-colors uppercase tracking-wide'
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Categories (Right Columns) */}
        <div className='w-4/5 grid grid-cols-4 gap-8'>
          {/* Column 1: Shop By Type */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-bold text-xs uppercase tracking-wide mb-2'>
              Shop By Type
            </h3>
            {SHOP_BY_TYPE.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className='text-sm hover:underline transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 2: Shop By Activity */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-bold text-xs uppercase tracking-wide mb-2'>
              Shop By Activity
            </h3>
            {SHOP_BY_ACTIVITY.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className='text-sm hover:underline transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 3: Shop By Feature */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-bold text-xs uppercase tracking-wide mb-2'>
              Shop By Feature
            </h3>
            {SHOP_BY_FEATURE.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className='text-sm hover:underline transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 4: Shop By Colour */}
          <div className='flex flex-col space-y-4'>
            <h3 className='font-bold text-xs uppercase tracking-wide mb-2'>
              Shop By Colour
            </h3>
            <div className='grid grid-cols-2 gap-y-4 gap-x-2'>
              {SHOP_BY_COLOUR.map((color) => (
                <Link
                  key={color.label}
                  href={`/shop/color/${color.label.toLowerCase()}`}
                  className='flex items-center gap-3 text-sm hover:underline transition-colors group '
                >
                  <span
                    className={`w-4 h-4 rounded-sm flex-shrink-0 relative overflow-hidden border border-neutral-300 ${
                      color.border ? 'border border-neutral-300' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {color.split && (
                      <span
                        className='absolute inset-0 bg-black  '
                        style={{
                          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                        }}
                      />
                    )}
                  </span>
                  <span>{color.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopDropdown
