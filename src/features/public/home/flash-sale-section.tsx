'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { _homeService } from './home.query'
import ProductCard from '~/components/ui/core/product-card'
import { Zap } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/core/carousel'

const FlashSaleSection = () => {
  const { data: flashSalesData, isLoading } = _homeService.useFlashSales()
  const products = flashSalesData?.result?.data || []

  // Get earliest ending discountEndDate among products that has active sale in the future
  const activeFlashSales = products.filter(
    (p) => p.discountEndDate && new Date(p.discountEndDate).getTime() > Date.now()
  )

  const earliestEndDate = activeFlashSales.length > 0
    ? new Date(
        Math.min(
          ...activeFlashSales.map((p) => new Date(p.discountEndDate!).getTime())
        )
      )
    : null

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // If no product has a discountEndDate in the future, fallback to a mock 2h countdown or 00:00:00
    if (!earliestEndDate) {
      setTimeLeft({ hours: 2, minutes: 0, seconds: 0 })
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
          if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
          if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
          return prev
        })
      }, 1000)
      return () => clearInterval(timer)
    }

    const updateTimer = () => {
      const diffMs = earliestEndDate.getTime() - Date.now()
      if (diffMs <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [earliestEndDate])

  if (isLoading) {
    return (
      <section className="py-20 bg-black overflow-hidden">
        <div className="main-container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="bg-neutral-800 w-12 h-12 rounded-2xl" />
              <div className="h-10 bg-neutral-800 w-48 rounded-xl" />
            </div>
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-4 bg-neutral-800 w-24 rounded" />
              <div className="bg-neutral-800 w-12 h-12 rounded-2xl" />
              <div className="bg-neutral-800 w-12 h-12 rounded-2xl" />
              <div className="bg-neutral-800 w-12 h-12 rounded-2xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col h-full bg-neutral-900 rounded-2xl p-2 animate-pulse border border-white/5"
              >
                <div className="aspect-[3/4] rounded-2xl bg-neutral-800 mb-4 w-full" />
                <div className="flex flex-col px-1 gap-2">
                  <div className="h-4 bg-neutral-800 rounded w-5/6" />
                  <div className="h-4 bg-neutral-800 rounded w-2/3" />
                  <div className="flex gap-2 items-center mt-2">
                    <div className="h-5 bg-neutral-800 rounded w-1/3" />
                    <div className="h-4 bg-neutral-800 rounded w-1/4" />
                  </div>
                  <div className="h-3 bg-neutral-800 rounded w-1/4 mt-3" />
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
    <section className="py-20 bg-black overflow-hidden">
      <div className="main-container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl animate-pulse">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Flash Sale
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest mr-2">Kết thúc trong:</span>
            {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
              <React.Fragment key={i}>
                <div className="bg-neutral-800 text-white w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black border border-white/10">
                  {unit.toString().padStart(2, '0')}
                </div>
                {i < 2 && <span className="text-primary font-black text-2xl">:</span>}
              </React.Fragment>
            ))}
          </div>
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-neutral-900 p-2 rounded-[2rem] border border-white/5 hover:border-primary/50 transition-colors group h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {products.length > 4 && (
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 bg-neutral-900 text-white hover:bg-primary border-white/10" />
              <CarouselNext className="-right-12 bg-neutral-900 text-white hover:bg-primary border-white/10" />
            </div>
          )}
        </Carousel>
      </div>
    </section>
  )
}

export default FlashSaleSection
