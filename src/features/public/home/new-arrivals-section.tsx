'use client'

import React from 'react'
import { motion } from 'motion/react'
import { _homeService } from './home.query'
import ProductCard from '~/components/ui/core/product-card'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/core/carousel'

const NewArrivalsSection = () => {
  const { data: newArrivalsData, isLoading } = _homeService.useNewArrivals()
  const products = newArrivalsData?.result?.data || []

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="main-container mx-auto px-4">
          <div className="flex items-end justify-between mb-12 animate-pulse">
            <div>
              <div className="h-12 bg-slate-100 w-64 rounded-xl mb-4" />
              <div className="h-6 bg-slate-100 w-40 rounded" />
            </div>
            <div className="h-10 bg-slate-100 w-32 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col h-full bg-white rounded-2xl p-2 animate-pulse"
              >
                <div className="aspect-[3/4] rounded-2xl bg-slate-100 mb-4 w-full" />
                <div className="flex flex-col px-1 gap-2">
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="flex gap-2 items-center mt-2">
                    <div className="h-5 bg-slate-100 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                  </div>
                  <div className="h-3 bg-slate-100 rounded w-1/4 mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="main-container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-4">
              Mới về <br /> <span className="text-primary text-2xl md:text-3xl tracking-normal">Tháng 5, 2026</span>
            </h2>
          </div>
          <Link 
            href="/shop?sort=newest" 
            className="group flex items-center gap-3 font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors"
          >
            Xem tất cả 
            <span className="bg-gray-100 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-all">→</span>
          </Link>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product, idx) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: idx * 0.1,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {products.length > 4 && (
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 hover:bg-primary hover:text-white border-none shadow-xl" />
              <CarouselNext className="-right-12 hover:bg-primary hover:text-white border-none shadow-xl" />
            </div>
          )}
        </Carousel>
      </div>
    </section>
  )
}

export default NewArrivalsSection
