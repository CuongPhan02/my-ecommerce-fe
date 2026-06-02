'use client'

import React, { useState } from 'react'
import { Ticket, Info, Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

import { _voucherService } from '~/features/public/voucher/voucher.query'

interface CartSummaryProps {
  subtotal: number
  total: number
  discountAmount?: number
  onApplyVoucher?: (code: string) => void
  isApplyingVoucher?: boolean
  appliedVoucherCode?: string
  isSubmitting?: boolean
  onOrder: () => void
}

const CartSummary = ({
  subtotal,
  total,
  discountAmount = 0,
  onApplyVoucher,
  isApplyingVoucher,
  appliedVoucherCode,
  isSubmitting,
  onOrder,
}: CartSummaryProps) => {
  const [tempCode, setTempCode] = useState('')
  const { data: publicVouchersRes } = _voucherService.usePublicVouchers()
  const availableVouchers = publicVouchersRes?.result || []

  const handleApply = () => {
    if (onApplyVoucher && tempCode) {
      onApplyVoucher(tempCode)
    }
  }

  return (
    <div className="flex flex-col gap-8 sticky top-24">
      {/* Vouchers horizontal scroll */}
      {availableVouchers.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Ưu đãi dành riêng cho bạn</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
             {availableVouchers.map((v) => {
               const isApplied = appliedVoucherCode === v.code
               const isEligible = subtotal >= v.minOrderValue
               return (
                 <div 
                   key={v.id} 
                   onClick={() => isEligible && onApplyVoucher?.(v.code)}
                   className={cn(
                     "min-w-[280px] bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden select-none",
                     isApplied ? "border-blue-600 bg-blue-50/10" : "border-gray-100 hover:border-gray-200",
                     !isEligible && "opacity-40 cursor-not-allowed"
                   )}
                 >
                    <div className="flex justify-between items-start mb-3">
                       <div className={cn(
                         "p-2 rounded-xl transition-all",
                         isApplied ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                       )}>
                          <Ticket className="w-5 h-5" />
                       </div>
                       <div className={cn(
                         "w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all",
                         isApplied ? "border-blue-600 bg-blue-600" : "border-gray-200"
                       )}>
                         {isApplied && <span className="w-2 h-2 bg-white rounded-full" />}
                       </div>
                    </div>
                    <p className="font-black text-sm mb-1">{v.code}</p>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-4 line-clamp-2">{v.description || `Giảm ${v.discountValueFormatted} cho đơn từ ${v.minOrderValueFormatted}`}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        HSD: {v.expirationDate ? new Date(v.expirationDate).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                      </p>
                      {!isEligible && (
                        <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Chưa đủ đk</span>
                      )}
                    </div>
                 </div>
               )
             })}
          </div>
        </div>
      )}

      {/* Discount Input */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
           <input 
             type="text" 
             value={tempCode}
             onChange={(e) => setTempCode(e.target.value.toUpperCase())}
             placeholder="Nhập mã giảm giá" 
             className="flex-1 py-3 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all uppercase bg-white border-gray-200"
           />
           <button 
             onClick={handleApply}
             disabled={isApplyingVoucher || !tempCode}
             className="bg-black text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all border-none outline-none cursor-pointer disabled:bg-gray-200"
           >
             {isApplyingVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Áp dụng'}
           </button>
        </div>
        {appliedVoucherCode && (
          <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-50">
             <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
               Mã đang áp dụng: {appliedVoucherCode}
             </span>
             <button 
               onClick={() => onApplyVoucher?.('')}
               className="text-[10px] font-black text-red-500 uppercase tracking-widest cursor-pointer hover:underline border-none bg-transparent"
             >
               Hủy
             </button>
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-gray-50 p-8 rounded-3xl flex flex-col gap-6">
         <h3 className="text-xl font-black uppercase tracking-tight">Chi tiết thanh toán</h3>
         
         <div className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between font-medium text-gray-500">
               <span>Tạm tính</span>
               <span className="font-bold text-black">{subtotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between font-medium text-gray-500">
                 <span>Voucher giảm giá</span>
                 <span className="font-bold text-green-600">-{discountAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-gray-500">
               <span>Phí giao hàng</span>
               <span className="font-bold text-black uppercase text-[10px] tracking-widest">Miễn phí</span>
            </div>
         </div>

         <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
            <span className="text-lg font-black uppercase tracking-tight">Thành tiền</span>
            <span className="text-2xl font-black text-black">{total.toLocaleString('vi-VN')} ₫</span>
         </div>

         <button 
           onClick={onOrder}
           disabled={isSubmitting}
           className={cn(
             "w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-primary transition-all shadow-xl shadow-black/10 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-none outline-none cursor-pointer",
             isSubmitting && "bg-primary"
           )}
         >
           {isSubmitting ? (
             <>
               <Loader2 className="w-4 h-4 animate-spin text-white animate-infinite" />
               Đang xử lý đặt hàng...
             </>
           ) : (
             'Đặt hàng'
           )}
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

