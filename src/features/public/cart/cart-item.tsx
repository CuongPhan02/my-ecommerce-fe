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
      <div className="pt-2">
        <input 
          type="checkbox" 
          defaultChecked 
          className="w-4.5 h-4.5 accent-[#5c4e43] rounded-sm cursor-pointer" 
        />
      </div>

      {/* Image */}
      <div className="relative w-20 aspect-[3/4] rounded-sm overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
        {product.thumbnailUrl ? (
          <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-[10px] text-neutral-400">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
           <h3 className="font-bold text-xs leading-tight hover:text-[#5c4e43] transition-colors cursor-pointer">{product.name}</h3>
           <span className="font-black text-xs text-[#231f20] whitespace-nowrap">{variant.price.toLocaleString('vi-VN')} ₫</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
           {variant.sku && (
             <span className="px-2 py-0.5 bg-[#FBF8F3] border border-[#e8dfd5]/45 rounded-sm text-[8px] font-bold text-neutral-500 uppercase tracking-widest">
               SKU: {variant.sku}
             </span>
           )}
           {variant.attributes?.map((attr, idx) => {
             const attrName = attr.attributeValue?.attribute?.name || attr.name || ''
             const isColor = attrName.toLowerCase().includes('màu') || attrName.toLowerCase().includes('color')
             const displayValue = isColor
               ? (attr.attributeValue?.name || attr.name || attr.attributeValue?.value || attr.value || '')
               : (attr.attributeValue?.value || attr.value || attr.attributeValue?.name || attr.name || '')
             return (
               <span key={attr.id || `${attrName}-${idx}`} className="px-2 py-0.5 bg-[#FBF8F3] border border-[#e8dfd5]/45 rounded-sm text-[8px] font-bold text-neutral-500 uppercase tracking-widest">
                 {attrName}: {displayValue}
               </span>
             )
           })}
        </div>

        <div className="flex items-center justify-between mt-1">
           <div className="flex items-center bg-[#FBF8F3] border border-[#e8dfd5]/65 rounded-sm p-0.5 h-8">
             <button 
               onClick={() => {
                 if (quantity > 1) {
                   onUpdateQuantity(quantity - 1)
                 }
               }}
               disabled={quantity <= 1}
               className="w-7 h-full flex items-center justify-center hover:bg-white rounded-xs transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
             >
               <Minus className="w-2.5 h-2.5" />
             </button>
             <span className="w-7 text-center text-xs font-black">{quantity}</span>
             <button 
               onClick={() => {
                 if (quantity < variant.stockQuantity) {
                   onUpdateQuantity(quantity + 1)
                 }
               }}
               disabled={quantity >= variant.stockQuantity}
               className="w-7 h-full flex items-center justify-center hover:bg-white rounded-xs transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
             >
               <Plus className="w-2.5 h-2.5" />
             </button>
           </div>
           
           <button 
             onClick={onRemove}
             className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer border-none bg-transparent"
           >
             <Trash2 className="w-3 h-3" />
             Xóa
           </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
