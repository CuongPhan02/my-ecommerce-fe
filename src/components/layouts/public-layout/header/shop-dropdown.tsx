'use client'

import * as React from 'react'
import { Link } from 'next-view-transitions'
import { MegaMenuConfig } from '~/features/admin/menu/types'
import { ArrowRight, Sparkles, Tag, ArrowUpRight } from 'lucide-react'

interface ShopDropdownProps {
  config: MegaMenuConfig | null
}

const ShopDropdown = ({ config }: ShopDropdownProps) => {
  if (!config) return null

  // 1. Find parent categories
  const parentCategories = config.categories?.filter(
    (c) => !c.parentId || !config.categories?.some((parent) => parent.id === c.parentId)
  ) || []

  // 2. Helper to resolve sub-categories of a parent
  const getSubCategories = (parentId: string) => {
    return config.categories?.filter((c) => c.parentId === parentId) || []
  }

  // 3. Find collections that have an image to showcase
  const featuredCollections = config.collections?.filter((col) => col.imageUrl && col.isActive) || []
  const hasFeatured = featuredCollections.length > 0
  const displayCollections = featuredCollections.slice(0, 4)

  return (
    <div className='w-full bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800/80 shadow-[0_35px_70px_-15px_rgba(0,0,0,0.15)] py-12 px-8 lg:px-16 overflow-y-auto max-h-[calc(100vh-100px)] border-b rounded-b-[2rem] transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start'>
          
          {/* CATALOG NAVIGATION (Left Pane) */}
          <div className={`${hasFeatured ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'}`}>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10'>
              {parentCategories.map((parent) => {
                const subCats = getSubCategories(parent.id)
                return (
                  <div key={parent.id} className='flex flex-col space-y-4 group/item'>
                    {/* Parent Category Title */}
                    <div className='relative'>
                      <Link
                        href={`/shop?categoryId=${parent.id}`}
                        className='font-black text-xs uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-50 pb-2 flex items-center justify-between group-hover/item:text-primary transition-colors border-b border-neutral-100 dark:border-neutral-800'
                      >
                        <span>{parent.name}</span>
                        <ArrowRight className='w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 text-primary shrink-0' />
                      </Link>
                      <span className='absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover/item:w-full transition-all duration-500' />
                    </div>

                    {/* Subcategories list */}
                    {subCats.length > 0 ? (
                      <div className='flex flex-col space-y-3'>
                        {subCats.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/shop?categoryId=${sub.id}`}
                            className='text-[13px] text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 hover:translate-x-1 flex items-center font-medium group/sub'
                          >
                            <span className='h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-800 mr-2 group-hover/sub:bg-primary group-hover/sub:scale-125 transition-all' />
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link 
                        href={`/shop?categoryId=${parent.id}`} 
                        className='text-[10px] text-neutral-400 dark:text-neutral-500 hover:text-primary transition-colors flex items-center gap-0.5 font-bold uppercase tracking-wider'
                      >
                        Khám phá <ArrowUpRight className='w-3 h-3' />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* GALLERY PANEL (Right Pane) */}
          {hasFeatured && (
            <div className='lg:col-span-4 xl:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-100 dark:border-neutral-800 pt-8 lg:pt-0 lg:pl-10 flex flex-col space-y-6'>
              <div className='flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3'>
                <div className='flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em]'>
                  <Sparkles className='w-4 h-4 text-primary animate-pulse' />
                  <span>Bộ Sưu Tập Nổi Bật</span>
                </div>
                <Link
                  href='/shop'
                  className='text-[10px] font-black uppercase tracking-wider text-neutral-400 hover:text-primary transition-colors'
                >
                  Xem tất cả
                </Link>
              </div>

              <div className={`grid ${displayCollections.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-5`}>
                {displayCollections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/shop?collectionId=${col.id}`}
                    className='group/card flex flex-col space-y-3 w-full'
                  >
                    {/* Framed Image Container */}
                    <div className='relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-sm transition-all duration-300'>
                      <img
                        src={col.imageUrl || ''}
                        alt={col.name}
                        className='w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover/card:scale-105'
                        loading='lazy'
                      />
                      <div className='absolute inset-0 bg-black/0 group-hover/card:bg-black/[0.03] transition-colors duration-300' />
                    </div>

                    {/* Content Beneath */}
                    <div className='flex flex-col space-y-1 px-1'>
                      <div className='flex items-center justify-between'>
                        <span className='font-black text-[13.5px] text-neutral-900 dark:text-neutral-50 tracking-wide group-hover/card:text-primary transition-colors duration-300'>
                          {col.name}
                        </span>
                        <ArrowUpRight className='w-4 h-4 text-neutral-400 group-hover/card:text-primary group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-all duration-300 shrink-0' />
                      </div>
                      {col.description && (
                        <p className='text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-snug font-medium'>
                          {col.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ATTRIBUTES LIST (Footer Pane) */}
        {config.attributes && config.attributes.length > 0 && (
          <div className='border-t border-neutral-100 dark:border-neutral-800 pt-6 mt-10 flex flex-wrap items-center gap-4'>
            <span className='text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5'>
              <Tag className='w-3.5 h-3.5' /> Gợi ý nổi bật:
            </span>
            <div className='flex flex-wrap gap-2.5'>
              {config.attributes.map((attr) => (
                <Link
                  key={attr.id}
                  href={`/shop`}
                  className='px-4.5 py-2 bg-neutral-50 hover:bg-primary/[0.04] dark:bg-neutral-900 dark:hover:bg-primary/[0.04] text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary border border-neutral-100 dark:border-neutral-800 hover:border-primary/20 rounded-full text-xs font-bold transition-all duration-300'
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
