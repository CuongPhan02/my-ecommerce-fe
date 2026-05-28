'use client'

import React from 'react'
import Image from 'next/image'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from './types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (newQuantity: number) => void
  onRemove: () => void
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const { quantity, variant, product } = item

  return (
    <div className="flex gap-6 py-6 border-b last:border-0 items-start">
      {/* Checkbox */}
      <div className="pt-4">
        <input type="checkbox" defaultChecked className="w-5 h-5 accent-black rounded-md cursor-pointer" />
      </div>

      {/* Image */}
      <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {product.thumbnailUrl ? (
          <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
           <h3 className="font-bold text-sm leading-tight hover:text-blue-600 transition-colors cursor-pointer">{product.name}</h3>
           <span className="font-black text-sm">{variant.price.toLocaleString('vi-VN')} ₫</span>
        </div>

        <div className="flex flex-wrap gap-2">
           {variant.sku && (
             <span className="px-2.5 py-1 bg-gray-50 border rounded-lg text-[9px] font-bold text-gray-500 uppercase tracking-widest">
               SKU: {variant.sku}
             </span>
           )}
           {variant.attributes?.map((attr, idx) => (
             <span key={attr.id || `${attr.name}-${idx}`} className="px-2.5 py-1 bg-gray-50 border rounded-lg text-[9px] font-bold text-gray-500 uppercase tracking-widest">
               {attr.name}: {attr.value}
             </span>
           ))}
        </div>

        <div className="flex items-center justify-between mt-2">
           <div className="flex items-center bg-gray-50 border rounded-xl p-0.5 h-10">
             <button 
               onClick={() => {
                 if (quantity > 1) {
                   onUpdateQuantity(quantity - 1)
                 }
               }}
               disabled={quantity <= 1}
               className="w-8 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
             >
               <Minus className="w-3 h-3" />
             </button>
             <span className="w-8 text-center text-xs font-black">{quantity}</span>
             <button 
               onClick={() => {
                 if (quantity < variant.stockQuantity) {
                   onUpdateQuantity(quantity + 1)
                 }
               }}
               disabled={quantity >= variant.stockQuantity}
               className="w-8 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
             >
               <Plus className="w-3 h-3" />
             </button>
           </div>
           
           <button 
             onClick={onRemove}
             className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
           >
             <Trash2 className="w-3.5 h-3.5" />
             Xóa
           </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
