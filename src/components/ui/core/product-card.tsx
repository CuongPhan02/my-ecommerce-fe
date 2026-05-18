'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Star, ShoppingCart } from 'lucide-react'
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
  const [isHovered, setIsHovered] = useState(false)
  const sizes = ['S', 'M', 'L', 'XL', '2XL']
  
  const isDbProduct = 'variants' in product && Array.isArray(product.variants)

  // 1. Price
  const price = isDbProduct 
    ? (product as Product).variants?.[0]?.price || 0 
    : (product as SimpleProduct).price || 0

  // 2. Discount Value
  const discountValue = isDbProduct ? (product as Product).discountValue : null
  const discountType = isDbProduct ? (product as Product).discountType : null

  // 3. Original Price
  const originalPrice = isDbProduct
    ? (discountValue 
        ? (discountType === 'PERCENTAGE' 
            ? price / (1 - (discountValue || 0) / 100) 
            : price + (discountValue || 0))
        : undefined)
    : (product as SimpleProduct).originalPrice

  // 4. Discount label percentage
  const discount = isDbProduct
    ? (discountType === 'PERCENTAGE' ? discountValue || 0 : 0)
    : (originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0)

  // 5. Rating & Reviews
  const rating = !isDbProduct ? (product as SimpleProduct).rating || 5 : 5
  const reviews = !isDbProduct ? (product as SimpleProduct).reviews || 0 : 0

  // 6. Badge
  const badge = isDbProduct 
    ? (product as Product).tags?.[0] 
    : (product as SimpleProduct).badge

  // 7. Image URL
  const imageUrl = isDbProduct
    ? (product as Product).thumbnail?.url || '/placeholder-product.png'
    : ((product as SimpleProduct).colors?.[0]?.image || (product as SimpleProduct).thumbnail?.url || '/placeholder-product.png')

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {badge && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Size Selection */}
        <div className={cn(
          "absolute inset-0 bg-black/5 flex flex-col items-center justify-center transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl w-[90%] shadow-2xl transform transition-transform duration-300 scale-95 group-hover:scale-100">
             <p className="text-[10px] font-bold text-center mb-3 text-gray-500 uppercase tracking-widest">Thêm nhanh vào giỏ hàng</p>
             <div className="grid grid-cols-3 gap-2">
               {sizes.map((size) => (
                 <button 
                   key={size}
                   className="py-2 border border-gray-100 rounded-lg text-[10px] font-bold hover:bg-black hover:text-white transition-all"
                 >
                   {size}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow px-1">
        <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 min-h-[40px] hover:text-primary cursor-pointer transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-3 mb-2">
          <span className="font-black text-base text-gray-900">
            {price.toLocaleString('vi-VN')}đ
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-gray-400 text-sm line-through decoration-red-400">
              {Math.round(originalPrice).toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mt-auto">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({reviews})</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
