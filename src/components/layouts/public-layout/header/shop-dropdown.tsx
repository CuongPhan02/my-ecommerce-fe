'use client'

import { Link } from 'next-view-transitions'
import { MegaMenuConfig } from '~/features/admin/menu/types'
import { ArrowRight, Sparkles, Tag } from 'lucide-react'

interface ShopDropdownProps {
  config: MegaMenuConfig | null
}

const ShopDropdown = ({ config }: ShopDropdownProps) => {
  if (!config) return null

  // 1. Find top-level categories (parentId is null)
  const parentCategories = config.categories?.filter((c) => !c.parentId) || []

  // 2. Helper to resolve sub-categories of a parent
  const getSubCategories = (parentId: string) => {
    return config.categories?.filter((c) => c.parentId === parentId) || []
  }

  // 3. Find collections that have an image to showcase on the right
  const featuredCollections = config.collections?.filter((col) => col.imageUrl && col.isActive) || []

  // Check if we have collections to display
  const hasFeatured = featuredCollections.length > 0

  return (
    <div className='w-full bg-white/95 backdrop-blur-xl border-t border-neutral-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] py-10 px-6 lg:px-16 overflow-y-auto max-h-[calc(100vh-100px)] border-b border-neutral-100 rounded-b-3xl scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12'>
          
          {/* CATALOG NAVIGATION (Left Pane) - Spans 8 cols if featured exists, otherwise 12 */}
          <div className={`${hasFeatured ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'}`}>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
              {parentCategories.map((parent) => {
                const subCats = getSubCategories(parent.id)
                return (
                  <div key={parent.id} className='flex flex-col space-y-4 group/item'>
                    {/* Parent Category Title */}
                    <Link
                      href={`/shop?categoryId=${parent.id}`}
                      className='font-black text-[13.5px] uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2 flex items-center justify-between group-hover/item:text-primary transition-colors'
                    >
                      <span>{parent.name}</span>
                      <ArrowRight className='w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-300 text-primary shrink-0' />
                    </Link>

                    {/* Subcategories list */}
                    {subCats.length > 0 ? (
                      <div className='flex flex-col space-y-2.5'>
                        {subCats.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/shop?categoryId=${sub.id}`}
                            className='text-[13.5px] text-neutral-500 hover:text-primary transition-all duration-200 hover:pl-2 flex items-center font-medium group/sub'
                          >
                            <span className='h-1 w-1 rounded-full bg-neutral-300 mr-2 group-hover/sub:bg-primary group-hover/sub:scale-125 transition-all' />
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className='text-xs text-neutral-400 italic font-medium'>
                        Xem tất cả sản phẩm
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* GALLERY PANEL (Right Pane) - Spans 4 cols on large screens */}
          {hasFeatured && (
            <div className='lg:col-span-4 xl:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-100 pt-8 lg:pt-0 lg:pl-8 flex flex-col space-y-5'>
              <div className='flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest border-b border-neutral-100 pb-2'>
                <Sparkles className='w-4 h-4 text-amber-500 animate-pulse' />
                <span>Bộ Sưu Tập Nổi Bật</span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-visible pr-1'>
                {featuredCollections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/shop?collectionId=${col.id}`}
                    className='relative group/card w-full h-[130px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-neutral-100 transition-all duration-300 flex'
                  >
                    {/* Left overlay info */}
                    <div className='flex-1 p-4 bg-gradient-to-r from-white via-white/95 to-white/40 z-10 flex flex-col justify-center max-w-[65%]'>
                      <span className='font-extrabold text-[13.5px] text-neutral-800 tracking-wide line-clamp-1 group-hover/card:text-primary transition-colors'>
                        {col.name}
                      </span>
                      {col.description && (
                        <p className='text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-snug font-medium'>
                          {col.description}
                        </p>
                      )}
                      <span className='text-[10px] font-bold text-primary flex items-center gap-1 mt-2.5 uppercase tracking-wider group-hover/card:gap-2 transition-all duration-300'>
                        Khám phá <ArrowRight className='w-3 h-3' />
                      </span>
                    </div>

                    {/* Right Background Image */}
                    <div className='absolute right-0 top-0 bottom-0 w-[50%] h-full overflow-hidden'>
                      <div className='absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10' />
                      <img
                        src={col.imageUrl || ''}
                        alt={col.name}
                        className='w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105'
                        loading='lazy'
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ATTRIBUTES LIST (Footer Pane) - If attributes exist */}
        {config.attributes && config.attributes.length > 0 && (
          <div className='border-t border-neutral-100 pt-6 mt-8 flex flex-wrap items-center gap-3'>
            <span className='text-[11px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5'>
              <Tag className='w-3.5 h-3.5' /> Gợi ý nổi bật:
            </span>
            <div className='flex flex-wrap gap-2'>
              {config.attributes.map((attr) => (
                <Link
                  key={attr.id}
                  href={`/shop`}
                  className='px-3.5 py-1.5 bg-neutral-50 hover:bg-primary/[0.04] text-neutral-600 hover:text-primary border border-neutral-100 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer hover:border-primary/20'
                >
                  {attr.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopDropdown
