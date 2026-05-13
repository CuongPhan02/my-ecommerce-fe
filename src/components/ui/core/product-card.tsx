'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Star, ShoppingCart } from 'lucide-react'
import { cn } from '~/lib/utils'

interface ProductColor {
  name: string
  hex: string
  image: string
}

interface ProductCardProps {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  colors: ProductColor[]
  sizes?: string[]
  badge?: string
}

const ProductCard = ({ name, price, originalPrice, rating, reviews, colors, sizes = ['S', 'M', 'L', 'XL', '2XL'], badge }: ProductCardProps) => {
  const [activeColorIndex, setActiveColorIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const activeColor = colors[activeColorIndex]
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <Image
          src={activeColor.image}
          alt={name}
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

        {/* Original Quick Add Button (Keep for home page or remove if unified) */}
        {/* <div className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] transition-all duration-300 transform",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <button className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
            <ShoppingCart className="w-4 h-4" />
            THÊM VÀO GIỎ
          </button>
        </div> */}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow px-1">
        {/* Colors */}
        <div className="flex gap-2 mb-3">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setActiveColorIndex(idx)}
              className={cn(
                "w-4 h-4 rounded-full border border-gray-200 transition-all p-[2px]",
                activeColorIndex === idx ? "ring-1 ring-black" : "hover:scale-110"
              )}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          ))}
        </div>

        <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 min-h-[40px] hover:text-primary cursor-pointer transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-3 mb-2">
          <span className="font-black text-base text-gray-900">
            {price.toLocaleString('vi-VN')}đ
          </span>
          {originalPrice && (
            <span className="text-gray-400 text-sm line-through decoration-red-400">
              {originalPrice.toLocaleString('vi-VN')}đ
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
