'use client'

import React from 'react'
import CartItem from '~/features/public/cart/cart-item'
import ShippingForm from '~/features/public/cart/shipping-form'
import PaymentSelection from '~/features/public/cart/payment-selection'
import CartSummary from '~/features/public/cart/cart-summary'
import StickyCheckoutBar from '~/features/public/cart/sticky-checkout-bar'
import { Info, X } from 'lucide-react'
import Link from 'next/link'

const mockCart = [
  {
    id: 1,
    name: 'Short nam 6inch Pickleball Smash Shot',
    price: 379000,
    color: 'Trắng',
    size: 'L',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    name: 'Tất Pickleball Nam Cổ Trung',
    price: 89000,
    color: 'Trắng',
    size: '39-42',
    quantity: 5,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600'
  }
]

export default function CartPage() {
  const subtotal = mockCart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-gray-50 border-b">
         <div className="main-container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
               <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Giỏ hàng</h1>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 Có 4 người đang thêm cùng sản phẩm giống bạn vào giỏ hàng.
               </p>
            </div>
            <div className="bg-blue-600 text-white p-6 rounded-3xl flex items-center gap-6 shadow-xl shadow-blue-600/20">
               <div>
                  <p className="text-sm font-black uppercase tracking-widest mb-1">Gia nhập COOLCLUB ngay</p>
                  <p className="text-[10px] opacity-80 font-medium">Nhận ngay Voucher -15% cho đơn hàng đầu tiên</p>
               </div>
               <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                  Tham gia
               </button>
            </div>
         </div>
      </div>

      <div className="main-container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left Column: Form & Payment */}
          <div className="lg:col-span-7 flex flex-col gap-16">
            <ShippingForm />
            <div className="h-px bg-gray-100" />
            <PaymentSelection />
          </div>

          {/* Right Column: Cart items & Summary */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Cart Header */}
            <div className="flex flex-col gap-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-black cursor-pointer" />
                    <span className="text-sm font-black uppercase tracking-widest">Tất cả sản phẩm</span>
                  </div>
                  <button className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">Xóa tất cả</button>
               </div>

               <div className="bg-blue-50/50 border border-blue-50 p-4 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                     <Info className="w-4 h-4" />
                     Yên tâm 60 ngày đổi trả - Freeship đơn từ 200k
                  </div>
                  <button className="text-blue-300 hover:text-blue-600 transition-colors"><X className="w-4 h-4" /></button>
               </div>
            </div>

            {/* Item List */}
            <div className="flex flex-col">
               {mockCart.map((item) => (
                 <CartItem key={item.id} {...item} />
               ))}
            </div>

            {/* Summary & Voucher */}
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      </div>

      <StickyCheckoutBar total={subtotal} />
    </div>
  )
}
