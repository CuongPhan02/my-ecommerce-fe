'use client'

import React from 'react'
import Image from 'next/image'
import { Plus, Minus, Trash2, ChevronDown } from 'lucide-react'
import { cn } from '~/lib/utils'

interface CartItemProps {
  id: number
  name: string
  price: number
  color: string
  size: string
  quantity: number
  image: string
}

const CartItem = ({ name, price, color, size, quantity, image }: CartItemProps) => {
  return (
    <div className="flex gap-6 py-6 border-b last:border-0 items-start">
      {/* Checkbox */}
      <div className="pt-4">
        <input type="checkbox" defaultChecked className="w-5 h-5 accent-black rounded-md cursor-pointer" />
      </div>

      {/* Image */}
      <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
           <h3 className="font-bold text-sm leading-tight hover:text-blue-600 transition-colors cursor-pointer">{name}</h3>
           <span className="font-black text-sm">{price.toLocaleString('vi-VN')} ₫</span>
        </div>

        <div className="flex flex-wrap gap-3">
           <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-lg text-[10px] font-bold text-gray-500 hover:bg-white transition-all uppercase tracking-widest">
             {color}
             <ChevronDown className="w-3 h-3" />
           </button>
           <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-lg text-[10px] font-bold text-gray-500 hover:bg-white transition-all uppercase tracking-widest">
             {size}
             <ChevronDown className="w-3 h-3" />
           </button>
        </div>

        <div className="flex items-center justify-between mt-2">
           <div className="flex items-center bg-gray-50 border rounded-xl p-0.5 h-10">
             <button className="w-8 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all">
               <Minus className="w-3 h-3" />
             </button>
             <span className="w-8 text-center text-xs font-black">{quantity}</span>
             <button className="w-8 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all">
               <Plus className="w-3 h-3" />
             </button>
           </div>
           
           <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">
             <Trash2 className="w-3.5 h-3.5" />
             Xóa
           </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
