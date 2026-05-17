'use client'

import React from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
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
  const collections = collectionsData?.result?.data || []

  if (isLoading || collections.length === 0) return null

  return (
    <section className='py-20 bg-white'>
      <div className='main-container mx-auto px-4'>
        {collections.map((collection, colIdx) => (
          <div key={collection.id} className={colIdx > 0 ? 'mt-20' : ''}>
            <div className='flex items-end justify-between mb-10'>
              <div>
                <h2 className='text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-2'>
                  {collection.name}
                </h2>
                {collection.description && (
                  <p className='text-gray-500 font-medium'>{collection.description}</p>
                )}
              </div>
              <Link
                href={`/collection/${collection.slug}`}
                className='group flex items-center gap-3 font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors'
              >
                Xem tất cả
                <span className='bg-gray-100 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-all'>
                  →
                </span>
              </Link>
            </div>

            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className='w-full'
            >
              <CarouselContent className='-ml-4'>
                {collection.products?.map((product, idx) => (
                  <CarouselItem
                    key={product.id}
                    className='pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4'
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className='hidden md:block'>
                <CarouselPrevious className='-left-12 hover:bg-primary hover:text-white border-none shadow-xl' />
                <CarouselNext className='-right-12 hover:bg-primary hover:text-white border-none shadow-xl' />
              </div>
            </Carousel>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CollectionSection
