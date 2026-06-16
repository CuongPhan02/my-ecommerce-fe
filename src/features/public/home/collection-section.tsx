'use client'

import React from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { PackageSearch } from 'lucide-react'
import { _homeService } from './home.query'
import ProductCard from '~/components/ui/core/product-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/core/carousel'

const CollectionSection = () => {
  const { data: collectionsData, isLoading } = _homeService.useCollections()
  const collections = (collectionsData?.result?.data || []).filter(
    (collection: any) => collection.isHomeActive === true
  )

  if (isLoading) {
    return (
      <section className='py-20 bg-white'>
        <div className='main-container mx-auto px-4'>
          {Array.from({ length: 2 }).map((_, colIdx) => (
            <div key={colIdx} className={colIdx > 0 ? 'mt-20 animate-pulse' : 'animate-pulse'}>
              <div className='flex items-end justify-between mb-10'>
                <div>
                  <div className='h-12 bg-slate-100 w-56 rounded-xl mb-3' />
                  <div className='h-5 bg-slate-100 w-72 rounded' />
                </div>
                <div className='h-10 bg-slate-100 w-32 rounded-full' />
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className='flex flex-col h-full bg-white rounded-2xl p-2'>
                    <div className='aspect-[3/4] rounded-2xl bg-slate-100 mb-4 w-full' />
                    <div className='flex flex-col px-1 gap-2'>
                      <div className='h-4 bg-slate-100 rounded w-5/6' />
                      <div className='h-4 bg-slate-100 rounded w-2/3' />
                      <div className='flex gap-2 items-center mt-2'>
                        <div className='h-5 bg-slate-100 rounded w-1/3' />
                        <div className='h-4 bg-slate-100 rounded w-1/4' />
                      </div>
                      <div className='h-3 bg-slate-100 rounded w-1/4 mt-3' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (collections.length === 0) return null

  return (
    <section className='py-20 bg-white'>
      <div className='main-container mx-auto px-4'>
        {collections.map((collection, colIdx) => {
          const productsList = collection.products || []
          const isEmpty = productsList.length === 0
          const showControls = productsList.length > 4

          const content = (
            <>
              {/* Section Header */}
              <div className='flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b pb-6 border-gray-100'>
                <div>
                  <h2 className='text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-2'>
                    {collection.name}
                  </h2>
                  {collection.description && (
                    <p className='text-gray-500 font-medium text-sm md:text-base'>
                      {collection.description}
                    </p>
                  )}
                </div>
                <div className='flex items-center gap-6 self-start md:self-auto'>
                  <Link
                    href={`/shop?collectionId=${collection.id}`}
                    className='group flex items-center gap-3 font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors'
                  >
                    Xem tất cả
                    <span className='bg-gray-100 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300'>
                      →
                    </span>
                  </Link>
                  {!isEmpty && showControls && (
                    <div className='hidden md:flex items-center gap-2'>
                      <CarouselPrevious className='static translate-y-0 top-auto left-auto right-auto w-11 h-11 hover:bg-primary hover:text-white border border-gray-200 shadow-sm transition-all duration-300' />
                      <CarouselNext className='static translate-y-0 top-auto left-auto right-auto w-11 h-11 hover:bg-primary hover:text-white border border-gray-200 shadow-sm transition-all duration-300' />
                    </div>
                  )}
                </div>
              </div>

              {/* Empty State */}
              {isEmpty ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className='flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 text-center'
                >
                  <div className='w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-5'>
                    <PackageSearch className='w-8 h-8 text-gray-400' />
                  </div>
                  <h3 className='text-base font-black text-gray-700 mb-1.5 uppercase tracking-tight'>
                    Chưa có sản phẩm
                  </h3>
                  <p className='text-sm text-gray-400 font-medium max-w-xs leading-relaxed'>
                    Bộ sưu tập{' '}
                    <span className='text-gray-600 font-bold'>"{collection.name}"</span>{' '}
                    chưa có sản phẩm nào. Hãy quay lại sau nhé!
                  </p>
                  <Link
                    href='/shop'
                    className='mt-6 inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-primary transition-colors duration-300'
                  >
                    Khám phá tất cả sản phẩm →
                  </Link>
                </motion.div>
              ) : (
                /* Product Carousel */
                <CarouselContent className='-ml-4'>
                  {productsList.map((item, idx) => {
                    const product = (item as any).product || item
                    return (
                      <CarouselItem
                        key={product.id || idx}
                        className='pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4'
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.08 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
              )}
            </>
          )

          return (
            <div key={collection.id} className={colIdx > 0 ? 'mt-24' : ''}>
              {isEmpty ? (
                content
              ) : (
                <Carousel opts={{ align: 'start', loop: true }} className='w-full'>
                  {content}
                </Carousel>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default CollectionSection
