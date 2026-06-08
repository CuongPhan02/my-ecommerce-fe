'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, ShoppingBag, Trash2, ArrowRight, PackageOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '~/providers/wishlist-provider'
import { _publicProductApi } from '~/features/public/product/product.api'
import { Product } from '~/features/admin/product/types'
import { cn } from '~/lib/utils'
import { useRouter } from 'next/navigation'

// --- WishlistProductCard -------------------------------------------------
const WishlistProductCard = ({
  product,
  onRemove,
}: {
  product: Product
  onRemove: (id: string) => void
}) => {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  const price =
    Array.isArray(product.variants) && product.variants.length > 0
      ? (product.variants[0] as any)?.price || 0
      : 0

  const priceFormatted =
    Array.isArray(product.variants) && product.variants.length > 0
      ? (product.variants[0] as any)?.priceFormatted
      : null

  const discountValue = product.discountValue
  const discountType = product.discountType
  const originalPrice =
    discountValue && price > 0
      ? discountType === 'PERCENTAGE'
        ? price / (1 - discountValue / 100)
        : price + discountValue
      : null

  const discount =
    discountType === 'PERCENTAGE' && discountValue ? discountValue : 0

  const thumbnailUrl = product.thumbnail?.url || '/placeholder-product.png'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-neutral-200/70 rounded-sm overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FBF8F3]">
        <Link href={`/product/${product.id}`} className="absolute inset-0 block">
          <Image
            src={thumbnailUrl}
            alt={product.name}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-700',
              hovered ? 'scale-105' : 'scale-100',
            )}
          />
        </Link>

        {/* Badges */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#231f20] text-white text-[9px] font-black tracking-widest px-2.5 py-1 uppercase">
            -{discount}%
          </span>
        )}

        {/* Remove button */}
        <button
          onClick={() => onRemove(product.id)}
          className={cn(
            'absolute top-3 right-3 p-2 bg-white border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-300 transition-all duration-300 rounded-sm shadow-sm',
            hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3',
          )}
          title="Xóa khỏi yêu thích"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        {product.brand?.name && (
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
            {product.brand.name}
          </span>
        )}

        <Link href={`/product/${product.id}`}>
          <h3 className="text-xs font-bold text-[#231f20] line-clamp-2 min-h-[36px] hover:text-[#5c4e43] transition-colors tracking-tight leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-black text-sm text-[#231f20] tracking-tight">
            {priceFormatted || `${price.toLocaleString('vi-VN')} ₫`}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-neutral-400 text-xs line-through font-semibold">
              {Math.round(originalPrice).toLocaleString('vi-VN')} ₫
            </span>
          )}
        </div>

        <button
          onClick={() => router.push(`/product/${product.id}`)}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-[#231f20] hover:bg-[#5c4e43] text-white text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 rounded-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Xem sản phẩm
        </button>
      </div>
    </motion.div>
  )
}

// --- WishlistPage --------------------------------------------------------
const WishlistPage = () => {
  const { wishlistIds, toggleWishlist, clearWishlist } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const fetchProducts = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setProducts([])
      setFetched(true)
      return
    }
    setLoading(true)
    try {
      const results = await Promise.allSettled(
        ids.map((id) => _publicProductApi.getProductDetail(id)),
      )
      const loaded = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map((r) => r.value?.result)
        .filter(Boolean) as Product[]
      setProducts(loaded)
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setFetched(true)
    }
  }, [])

  useEffect(() => {
    fetchProducts(wishlistIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When a product is removed, filter it locally (no refetch needed)
  const handleRemove = useCallback(
    (id: string) => {
      toggleWishlist(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    },
    [toggleWishlist],
  )

  const handleClearAll = () => {
    clearWishlist()
    setProducts([])
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 pb-20">
      {/* Page header */}
      <div className="main-container mx-auto px-4 mb-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#5c4e43] mb-2">
              Bộ sưu tập cá nhân
            </p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#231f20] flex items-center gap-3">
              Yêu thích
              <Heart className="w-7 h-7 text-rose-400 fill-rose-400" />
            </h1>
            <p className="text-xs font-semibold text-neutral-400 mt-2 uppercase tracking-widest">
              {wishlistIds.length} sản phẩm đã lưu
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-neutral-200" />
      </div>

      {/* Content */}
      <div className="main-container mx-auto px-4">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: wishlistIds.length || 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-neutral-100 rounded-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[3/4] bg-neutral-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-neutral-100 rounded w-1/3" />
                  <div className="h-4 bg-neutral-100 rounded w-full" />
                  <div className="h-4 bg-neutral-100 rounded w-2/3" />
                  <div className="h-10 bg-neutral-100 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && fetched && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#FBF8F3] border border-neutral-200 flex items-center justify-center mb-6">
              <PackageOpen className="w-9 h-9 text-neutral-300" />
            </div>
            <h2 className="text-base font-black uppercase tracking-widest text-[#231f20] mb-2">
              Chưa có sản phẩm yêu thích
            </h2>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider max-w-xs leading-relaxed">
              Nhấn vào biểu tượng trái tim trên sản phẩm để lưu vào đây
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#231f20] hover:bg-[#5c4e43] text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm"
            >
              Khám phá sản phẩm
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

        {!loading && products.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {products.map((product) => (
                <WishlistProductCard
                  key={product.id}
                  product={product}
                  onRemove={handleRemove}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Continue shopping */}
        {!loading && products.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5c4e43] hover:text-[#231f20] border-b border-[#5c4e43] hover:border-[#231f20] pb-0.5 transition-colors"
            >
              Tiếp tục mua sắm
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
