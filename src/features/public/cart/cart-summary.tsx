'use client'

import React from 'react'
import { Ticket, ChevronRight, Info } from 'lucide-react'
import { cn } from '~/lib/utils'

const vouchers = [
  { id: 'SIPMAT', code: 'SIPMAT', desc: 'Tặng Quần Lót Nam Trunk Bamboo Fortune trị giá 99K cho đơn từ 599K', expiry: '31/05/2026' },
  { id: 'CM150', code: 'CM150', desc: 'Giảm 150K cho đơn từ 999K (không áp dụng Outlet)', expiry: '31/05/2026' },
]

const CartSummary = ({ subtotal }: { subtotal: number }) => {
  return (
    <div className="flex flex-col gap-8 sticky top-24">
      {/* Vouchers horizontal scroll */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Ưu đãi dành riêng cho bạn</h3>
           <button className="text-[10px] font-bold text-blue-600 hover:underline">Xem tất cả</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {vouchers.map((v) => (
             <div key={v.id} className="min-w-[280px] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Ticket className="w-5 h-5" />
                   </div>
                   <div className="w-5 h-5 border-2 rounded-full border-gray-200" />
                </div>
                <p className="font-black text-sm mb-1">{v.code}</p>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-4 line-clamp-2">{v.desc}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">HSD: {v.expiry}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Discount Input */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
           <input 
             type="text" 
             placeholder="Nhập mã giảm giá" 
             className="flex-1 py-3 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all"
           />
           <button className="bg-black text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all">
             Áp dụng
           </button>
        </div>
        <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-50">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mã giới thiệu bạn bè</span>
           <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-white transition-all">Nhập mã</button>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-gray-50 p-8 rounded-3xl flex flex-col gap-6">
         <h3 className="text-xl font-black uppercase tracking-tight">Chi tiết thanh toán</h3>
         
         <div className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between font-medium text-gray-500">
               <span>Tạm tính</span>
               <span className="font-bold text-black">{subtotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between font-medium text-gray-500">
               <span>Voucher giảm giá</span>
               <span className="font-bold text-green-600">0 ₫</span>
            </div>
            <div className="flex justify-between font-medium text-gray-500">
               <span>Phí giao hàng</span>
               <span className="font-bold text-black uppercase text-[10px] tracking-widest">Miễn phí</span>
            </div>
         </div>

         <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
            <span className="text-lg font-black uppercase tracking-tight">Thành tiền</span>
            <span className="text-2xl font-black text-black">{subtotal.toLocaleString('vi-VN')} ₫</span>
         </div>

         <button className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-primary transition-all shadow-xl shadow-black/10 mt-4">
           Đặt hàng
         </button>
         
         <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center mt-2 flex items-center justify-center gap-2">
            <Info className="w-3 h-3" />
            Nhận hàng sau 1-3 ngày làm việc
         </p>
      </div>
    </div>
  )
}

export default CartSummary
