'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Product } from '~/features/admin/product/types'

export interface SimpleProduct {
  id: string | number
  name: string
  price: number
  originalPrice?: number
  rating?: number
  reviews?: number
  badge?: string
  colors?: {
    name: string
    hex: string
    image: string
  }[]
  thumbnail?: {
    url: string
  }
}

interface ProductCardProps {
  product: Product | SimpleProduct
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const isDbProduct = 'slug' in product

  // --- Price ---
  const price =
    isDbProduct && Array.isArray((product as Product).variants) && (product as Product).variants.length > 0
      ? (product as Product).variants[0]?.price || 0
      : (product as any).price || 0

  const priceFormatted =
    isDbProduct && Array.isArray((product as Product).variants) && (product as Product).variants.length > 0
      ? ((product as Product).variants[0] as any)?.priceFormatted || (product as any)?.priceFormatted
      : (product as any)?.priceFormatted

  // --- Discount ---
  const discountValue = isDbProduct ? (product as Product).discountValue : null
  const discountType = isDbProduct ? (product as Product).discountType : null
  const originalPrice = isDbProduct
    ? discountValue
      ? discountType === 'PERCENTAGE'
        ? price / (1 - (discountValue || 0) / 100)
        : price + (discountValue || 0)
      : undefined
    : (product as SimpleProduct).originalPrice
  const originalPriceFormatted =
    isDbProduct && Array.isArray((product as Product).variants) && (product as Product).variants.length > 0
      ? ((product as Product).variants[0] as any)?.originalPriceFormatted || (product as any)?.originalPriceFormatted
      : (product as any)?.originalPriceFormatted
  const discount = isDbProduct
    ? discountType === 'PERCENTAGE'
      ? discountValue || 0
      : 0
    : originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // --- Rating ---
  const rating = !isDbProduct ? (product as SimpleProduct).rating || 5 : 5
  const reviews = !isDbProduct ? (product as SimpleProduct).reviews || 0 : 0

  // --- Badge ---
  const badge = isDbProduct
    ? (product as Product).tags?.[0]
    : (product as SimpleProduct).badge

  // --- Images ---
  const allImages = useMemo(() => {
    const urls: string[] = []
    if (isDbProduct) {
      const dbProduct = product as Product
      if (dbProduct.thumbnail?.url) urls.push(dbProduct.thumbnail.url)
      if (Array.isArray(dbProduct.images)) {
        dbProduct.images.forEach((img) => {
          const u = img.url || img.media?.url
          if (u && !urls.includes(u)) urls.push(u)
        })
      }
    } else {
      const sp = product as SimpleProduct
      if (sp.thumbnail?.url) urls.push(sp.thumbnail.url)
      if (Array.isArray(sp.colors)) {
        sp.colors.forEach((c) => {
          if (c.image && !urls.includes(c.image)) urls.push(c.image)
        })
      }
    }
    if (urls.length === 0) urls.push('/placeholder-product.png')
    return urls
  }, [product, isDbProduct])

  const currentImageUrl = allImages[activeImageIndex] || '/placeholder-product.png'

  // --- Variants for quick-select panel ---
  const variants = useMemo(() => {
    if (!isDbProduct) return []
    return (product as Product).variants || []
  }, [product, isDbProduct])

  // --- Image navigation ---
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }
  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setActiveImageIndex((prev) => (prev + 1) % allImages.length)
  }

  // --- Redirect to Details page ---
  const handleFloatingCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    router.push(`/product/${product.id}`)
  }

  return (
    <motion.div
      className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_24px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:border-gray-200/60 transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setActiveImageIndex(0)
      }}
    >
      {/* Image Container & Carousel */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 w-full select-none">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0 block w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0.75, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.75 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                priority={activeImageIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {badge && (
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase shadow-md shadow-indigo-200/50">
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white text-[9px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase shadow-md shadow-red-200/50">
              -{discount}%
            </span>
          )}
        </div>

        {/* Floating Cart Button */}
        <div className={cn(
          "absolute top-3 right-3 flex flex-col gap-2 z-10 transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3 pointer-events-none"
        )}>
          <button
            onClick={handleFloatingCartClick}
            className="p-2.5 bg-white/90 hover:bg-primary hover:text-white backdrop-blur-md rounded-full shadow-md text-slate-800 transition-all duration-300 active:scale-95 group/btn"
            title="Xem chi tiết"
          >
            <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
          </button>
        </div>

        {/* Image Carousel Chevrons */}
        {allImages.length > 1 && (
          <div className={cn(
            "absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between z-10 pointer-events-none transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <button onClick={handlePrevImage} className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto backdrop-blur-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextImage} className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto backdrop-blur-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Indicator Dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 inset-x-4 flex items-center gap-1 z-10 pointer-events-auto transition-opacity duration-300">
            {allImages.map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveImageIndex(i)}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImageIndex(i) }}
                className="flex-1 h-1 rounded-full transition-all duration-300 relative group/indicator"
              >
                <div className={cn(
                  "absolute inset-0 rounded-full transition-all duration-300",
                  i === activeImageIndex ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] scale-y-125" : "bg-white/40 hover:bg-white/70"
                )} />
              </button>
            ))}
          </div>
        )}


      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow p-4 bg-white">
        {isDbProduct && (product as Product).brand?.name && (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            {(product as Product).brand.name}
          </span>
        )}

        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-sm text-slate-800 mb-2 line-clamp-2 min-h-[40px] hover:text-primary cursor-pointer transition-colors duration-300 tracking-tight leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-300 hover:scale-110",
                  i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"
                )}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-400">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <div className="flex items-baseline gap-2">
            <span className="font-black text-base text-slate-900 tracking-tight">
              {priceFormatted || `${price.toLocaleString('vi-VN')} ₫`}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-slate-400 text-xs line-through decoration-rose-500/60 font-semibold">
                {originalPriceFormatted || `${Math.round(originalPrice).toLocaleString('vi-VN')} ₫`}
              </span>
            )}
          </div>
          {/* Variant count badge */}
          {variants.length > 1 && (
            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
              {variants.length} phiên bản
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
