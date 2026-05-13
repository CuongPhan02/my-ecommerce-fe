'use client'

import React, { useState } from 'react'
import { Star, Share2, Plus, Minus, ShoppingBag, Heart } from 'lucide-react'
import { cn } from '~/lib/utils'

interface ProductInfoProps {
  name: string
  price: number
  originalPrice?: number
  colors: { name: string; hex: string }[]
  sizes: string[]
}

const ProductInfo = ({ name, price, originalPrice, colors, sizes }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState('L')
  const [quantity, setQuantity] = useState(1)

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className="flex flex-col gap-8">
      {/* Title & Rating */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
           <span>Coolmate</span>
           <span>/</span>
           <span>Áo Sweater</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">{name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={cn("w-4 h-4 fill-current", s <= 4 ? "text-black" : "text-gray-200")} />
            ))}
            <span className="text-sm font-bold ml-1">(4.9)</span>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
            <Share2 className="w-4 h-4" />
            Chia sẻ
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-black text-black">{price.toLocaleString()}đ</span>
          {originalPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">{originalPrice.toLocaleString()}đ</span>
              <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full">-{discount}%</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span className="text-green-600 font-bold">Freeship</span> đơn trên 200K
        </div>
      </div>

      {/* CoolCash Promo */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-blue-100 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">C</div>
          <div>
            <p className="text-sm font-bold text-blue-900">Được hoàn lên đến 14.000 CoolCash</p>
            <p className="text-xs text-blue-700">Dành riêng cho thành viên CoolClub</p>
          </div>
        </div>
        <Plus className="w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform" />
      </div>

      {/* Color Selection */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-black uppercase tracking-wider">Màu sắc: <span className="text-gray-500">{colors[selectedColor].name}</span></p>
        </div>
        <div className="flex gap-3">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColor(idx)}
              className={cn(
                "w-12 h-12 rounded-full border-2 transition-all p-1",
                selectedColor === idx ? "border-black" : "border-transparent hover:border-gray-200"
              )}
            >
              <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: color.hex }} />
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-black uppercase tracking-wider">Kích thước: <span className="text-gray-500">{selectedSize}</span></p>
          <button className="text-xs font-bold text-blue-600 hover:underline italic">Hướng dẫn chọn size</button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "py-3 rounded-xl text-sm font-bold transition-all border-2",
                selectedSize === size 
                  ? "bg-black text-white border-black" 
                  : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex gap-4">
        <div className="flex items-center bg-gray-100 rounded-2xl p-1 h-14">
          <button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-12 h-full flex items-center justify-center hover:bg-white rounded-xl transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-black">{quantity}</span>
          <button 
             onClick={() => setQuantity(q => q + 1)}
             className="w-12 h-full flex items-center justify-center hover:bg-white rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button className="flex-1 bg-black text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10">
          <ShoppingBag className="w-5 h-5" />
          Thêm vào giỏ
        </button>
        <button className="w-14 h-14 border-2 border-gray-100 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-100 group transition-all">
          <Heart className="w-6 h-6 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
        </button>
      </div>

      {/* Support Info Grid */}
      <div className="grid grid-cols-2 gap-4 border-t pt-8 mt-4">
         {[
           { label: 'Free ship cho đơn từ 200k', icon: '🚚' },
           { label: 'Đổi trả trong 60 ngày', icon: '🔄' },
           { label: 'Hotline 1900.272737', icon: '📞' },
           { label: 'Kiểm tra hàng khi nhận', icon: '📦' },
         ].map((item, idx) => (
           <div key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-500">
             <span className="text-xl">{item.icon}</span>
             {item.label}
           </div>
         ))}
      </div>
    </div>
  )
}

export default ProductInfo
