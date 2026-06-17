'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { _homeService } from './home.query'

const StorySection = () => {
  const { data, isLoading } = _homeService.useCollections()

  const [isOpen, setIsOpen] = useState(false)
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [activeItemIndex, setActiveItemIndex] = useState(0)

  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Map dynamic collections data
  const collections = useMemo(() => {
    const list = data?.result?.data || []
    if (list.length === 0) return []

    return list
      .map((col) => {
        const products =
          col.products
            ?.map((item: any) => {
              const prod = item.product || item
              if (!prod || !prod.id) return null
              const price = prod.variants?.[0]?.price || 299000
              const priceFormatted = prod.variants?.[0]?.priceFormatted || prod.priceFormatted
              const url = prod.thumbnail?.url || '/placeholder-product.png'
              return {
                id: prod.id,
                name: prod.name,
                slug: prod.slug,
                price,
                priceFormatted,
                imageUrl: url,
                storyBg: url,
              }
            })
            .filter(Boolean) || []

        if (products.length === 0) return null

        return {
          id: col.id,
          name: col.name,
          imageUrl:
            col.imageUrl ||
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=300',
          products,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  }, [data])

  const selectedCollection = collections[activeStoryIndex]
  const activeProduct = selectedCollection?.products?.[activeItemIndex]

  // Handlers for switching slides
  const handleNextItem = () => {
    if (!selectedCollection) return

    if (activeItemIndex < selectedCollection.products.length - 1) {
      setActiveItemIndex((prev) => prev + 1)
      setProgress(0)
    } else {
      // Switch to next collection
      if (activeStoryIndex < collections.length - 1) {
        setActiveStoryIndex((prev) => prev + 1)
        setActiveItemIndex(0)
        setProgress(0)
      } else {
        // Last collection completed -> close stories
        setIsOpen(false)
      }
    }
  }

  const handlePrevItem = () => {
    if (!selectedCollection) return

    if (activeItemIndex > 0) {
      setActiveItemIndex((prev) => prev - 1)
      setProgress(0)
    } else {
      // Switch to previous collection
      if (activeStoryIndex > 0) {
        const prevColIndex = activeStoryIndex - 1
        setActiveStoryIndex(prevColIndex)
        setActiveItemIndex(collections[prevColIndex].products.length - 1)
        setProgress(0)
      } else {
        // Loop back to beginning
        setProgress(0)
      }
    }
  }

  // Story progress timer
  useEffect(() => {
    if (!isOpen || isPaused) {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current)
      return
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextItem()
          return 0
        }
        return prev + 1
      })
    }, 45) // Total ~4.5 seconds per slide

    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current)
    }
  }, [isOpen, isPaused, activeStoryIndex, activeItemIndex])

  if (isLoading) {
    return (
      <section className='py-8 md:py-12 bg-white border-b border-neutral-100'>
        <div className='container-layout mx-auto px-4'>
          <div className='flex items-center gap-6 overflow-x-auto pb-4 justify-start md:justify-center scrollbar-none no-scrollbar'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className='flex flex-col items-center gap-2.5 flex-shrink-0 animate-pulse'>
                <div className='w-16 h-16 md:w-20 md:h-20 rounded-full bg-neutral-200 border-2 border-white shadow-sm' />
                <div className='h-3 w-16 bg-neutral-200 rounded' />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (collections.length === 0) return null

  // Handle clicking left/right zones of active card
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const percentage = clickX / width

    if (percentage < 0.35) {
      handlePrevItem()
    } else {
      handleNextItem()
    }
  }

  const openStory = (storyIdx: number) => {
    setActiveStoryIndex(storyIdx)
    setActiveItemIndex(0)
    setProgress(0)
    setIsOpen(true)
    setIsPaused(false)
  }

  return (
    <>
      <section className='py-8 md:py-12 bg-white border-b border-neutral-100'>
        <div className='container-layout mx-auto px-4'>
          <div className='flex items-center gap-6 overflow-x-auto pb-4 justify-start md:justify-center scrollbar-none no-scrollbar'>
            {collections.map((col, idx) => (
              <motion.div
                key={col.id}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openStory(idx)}
                className='flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group'
              >
                {/* Visual Avatar with Instagram Gradient Border */}
                <div className='relative w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] bg-gradient-to-tr from-[#00a2e8] via-[#a855f7] to-[#e11d48] group-hover:scale-105 duration-300 transition-all'>
                  <div className='w-full h-full rounded-full border-[2.5px] border-white overflow-hidden bg-gray-100 shadow-sm'>
                    <img
                      src={col.imageUrl}
                      alt={col.name}
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:rotate-3'
                    />
                  </div>
                </div>

                {/* Collection Label */}
                <span className='text-[11px] md:text-[12.5px] font-bold text-[#231f20] group-hover:text-[#00a2e8] transition-colors tracking-tight text-center max-w-[90px] md:max-w-[110px] truncate'>
                  {col.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Story Immersive Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div className='fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center select-none'>
            {/* Clickable backdrop layers to close */}
            <div
              className='absolute inset-0 z-0'
              onClick={() => setIsOpen(false)}
            />

            {/* Left Story Switcher Trigger */}
            {activeStoryIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveStoryIndex((prev) => prev - 1)
                  setActiveItemIndex(0)
                  setProgress(0)
                }}
                className='absolute left-6 xl:left-24 hidden md:flex w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all z-20 border border-white/10 hover:scale-105'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
            )}

            {/* Right Story Switcher Trigger */}
            {activeStoryIndex < collections.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveStoryIndex((prev) => prev + 1)
                  setActiveItemIndex(0)
                  setProgress(0)
                }}
                className='absolute right-6 xl:right-24 hidden md:flex w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all z-20 border border-white/10 hover:scale-105'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            )}

            {/* Close Button top corner */}
            <button
              onClick={() => setIsOpen(false)}
              className='absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all z-30 border border-white/10 hover:rotate-90 duration-200'
            >
              <X className='w-6 h-6' />
            </button>

            {/* Core Story Phone frame */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className='relative w-full max-w-[420px] h-[92vh] md:h-[85vh] aspect-[9/16] bg-neutral-950 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col z-10'
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {/* Active Slide Background */}
              <div className='absolute inset-0 z-0' onClick={handleCardClick}>
                <img
                  src={activeProduct?.storyBg || ''}
                  alt={activeProduct?.name || ''}
                  className='w-full h-full object-cover pointer-events-none'
                />

                {/* Visual shade overlays */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none' />
              </div>

              {/* Story Overlay Controls */}
              <div className='relative z-20 p-4 pt-5 flex flex-col gap-3.5 bg-gradient-to-b from-black/70 to-transparent pointer-events-none'>
                {/* Segmented Progress Indicators */}
                <div className='flex items-center gap-1.5 w-full'>
                  {selectedCollection?.products?.map((_, idx) => {
                    let w = '0%'
                    if (idx < activeItemIndex) w = '100%'
                    if (idx === activeItemIndex) w = `${progress}%`

                    return (
                      <div
                        key={idx}
                        className='h-[3px] flex-grow bg-white/35 rounded-full overflow-hidden'
                      >
                        <div
                          className='h-full bg-white transition-all duration-75 ease-linear'
                          style={{ width: w }}
                        />
                      </div>
                    )
                  })}
                </div>

                {/* Profile Header */}
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-[#00a2e8] flex items-center justify-center p-[1px]'>
                      <div className='w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden'>
                        <img
                          src='/placeholder-logo.png'
                          alt='Store Logo'
                          className='w-6 h-6 object-contain'
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=50'
                          }}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col text-left'>
                      <span className='text-xs font-black text-white uppercase tracking-wider drop-shadow-sm'>
                        {selectedCollection?.name}
                      </span>
                      <span className='text-[10px] text-white/70 font-semibold drop-shadow-sm'>
                        Đang hoạt động
                      </span>
                    </div>
                  </div>

                  {/* Volume audio controller toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMuted(!isMuted)
                    }}
                    className='p-1.5 rounded-full bg-black/35 hover:bg-black/55 pointer-events-auto text-white transition-colors border border-white/5 backdrop-blur-sm'
                  >
                    {isMuted ? (
                      <VolumeX className='w-3.5 h-3.5' />
                    ) : (
                      <Volume2 className='w-3.5 h-3.5' />
                    )}
                  </button>
                </div>
              </div>

              {/* Story Middle Body Caption */}
              <div className='flex-grow pointer-events-none' />

              {/* Story Bottom Interactive Drawer */}
              <div className='relative z-20 p-5 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-4'>
                {/* Floating Widget details */}
                {activeProduct && (
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className='text-left pointer-events-none'
                  >
                    <h3 className='text-base md:text-lg font-extrabold text-white leading-snug uppercase tracking-tight drop-shadow-md line-clamp-2'>
                      {activeProduct.name}
                    </h3>
                  </motion.div>
                )}

                {/* Glassmorphic Product Card details */}
                {activeProduct && (
                  <Link
                    href={`/product/${activeProduct.id}`}
                    onClick={() => setIsOpen(false)}
                    className='flex items-center justify-between bg-white/95 hover:bg-white text-neutral-900 p-3.5 rounded-2xl transition-all duration-300 pointer-events-auto active:scale-[0.98] group hover:shadow-lg hover:shadow-white/10 shadow-md'
                  >
                    <div className='flex items-center gap-3 text-left'>
                      <div className='relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/50 flex-shrink-0'>
                        <img
                          src={activeProduct.imageUrl}
                          alt={activeProduct.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className='flex flex-col justify-center'>
                        <span className='text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1'>
                          Xem sản phẩm
                        </span>
                        <span className='text-[14px] font-black text-neutral-900 leading-none'>
                          {activeProduct.priceFormatted || `${activeProduct.price.toLocaleString('vi-VN')} ₫`}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#00a2e8] group-hover:text-white text-neutral-900 transition-colors shadow-sm'>
                      <ChevronRight className='w-4 h-4' />
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default StorySection
