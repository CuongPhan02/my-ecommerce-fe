'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { _settingsService } from '~/features/admin/settings/settings.query'

const defaultBanners = [
  {
    id: 'temp-1779539602821',
    heading: 'Khám phá Bộ sưu tập Mới',
    isActive: true,
    mediaUrl:
      'https://ik.imagekit.io/aose833et/media-ak-shop/demo/product-angry-vegeta-dragon-5120x2880-17596_-_Copy_20yQcUbiC',
    mediaType: 'image',
    buttonLink: '/shop',
    buttonText: 'Mua ngay',
    subheading: 'Trải nghiệm phong cách thời thượng và hiện đại bậc nhất',
    displayOrder: 1,
    thumbnailUrl: null,
  },
  {
    id: 'temp-1779539561344',
    heading: 'Thời Trang Cao Cấp',
    isActive: true,
    mediaUrl:
      'https://ik.imagekit.io/aose833et/media-ak-shop/demo/demo-4/product-wallpapersden_e13emXnH4',
    mediaType: 'image',
    buttonLink: '/shop',
    buttonText: 'Khám phá ngay',
    subheading: 'Nâng tầm phong cách cá nhân với các thiết kế độc quyền',
    displayOrder: 2,
    thumbnailUrl: null,
  },
]

const HeroSection = () => {
  const { data } = _settingsService.useHeroBannerSettings()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Extract and sort active banners
  const banners = React.useMemo(() => {
    if (!data?.result?.items || data.result.items.length === 0) {
      return defaultBanners
    }
    return data.result.items
      .filter((item) => item.isActive && item.mediaUrl)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }, [data])

  // Reset index if banners list changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [banners.length])

  // Auto-play loop
  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(timer)
  }, [currentIndex, banners.length])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <div className='relative w-full h-[60vh] md:h-[85vh] overflow-hidden bg-[#121212] select-none'>
      {/* Overlapping Cross-Fade Slides Stack */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        {banners.map((item, index) => {
          const isActive = index === currentIndex
          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
              className='absolute inset-0 w-full h-full flex flex-col justify-center px-6 md:px-20 lg:px-32 xl:px-40'
              style={{
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 10 : 0,
              }}
            >
              {/* Media Background */}
              {item.mediaType === 'video' ? (
                <video
                  src={item.mediaUrl || ''}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className='w-full h-full object-cover object-center absolute inset-0 -z-10'
                />
              ) : (
                <img
                  src={item.mediaUrl || ''}
                  alt={item.heading || 'Hero Banner'}
                  className='w-full h-full object-cover object-center absolute inset-0 -z-10'
                />
              )}


            </motion.div>
          )
        })}
      </div>

      {/* Glassmorphic Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <div className='absolute inset-y-0 left-4 md:left-8 flex items-center z-20'>
            <button
              onClick={handlePrev}
              className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-black/45 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-105 duration-200'
              aria-label='Previous slide'
            >
              <ChevronLeft className='w-6 h-6 md:w-7 h-7' />
            </button>
          </div>
          <div className='absolute inset-y-0 right-4 md:right-8 flex items-center z-20'>
            <button
              onClick={handleNext}
              className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-black/45 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-105 duration-200'
              aria-label='Next slide'
            >
              <ChevronRight className='w-6 h-6 md:w-7 h-7' />
            </button>
          </div>
        </>
      )}

      {/* Bullet Dot Indicators */}
      {banners.length > 1 && (
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 bg-black/20 px-3.5 py-2 rounded-full border border-white/5 backdrop-blur-md'>
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/40 hover:bg-white/60 w-2'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroSection
