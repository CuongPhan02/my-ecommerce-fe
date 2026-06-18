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
  shippingFee?: number
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
  shippingFee = 0,
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
             <h3 className="font-black text-xs uppercase tracking-widest text-[#5c4e43]">Ưu đãi dành riêng cho bạn</h3>
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
                      "min-w-[280px] bg-white border rounded-sm p-4 shadow-xs hover:shadow-sm transition-all group cursor-pointer relative overflow-hidden select-none",
                      isApplied ? "border-[#5c4e43] bg-[#FAF6F0]" : "border-neutral-200 hover:border-[#e8dfd5]",
                      !isEligible && "opacity-40 cursor-not-allowed"
                    )}
                  >
                     <div className="flex justify-between items-start mb-3">
                        <div className={cn(
                          "p-2 rounded-sm transition-all",
                          isApplied ? "bg-[#5c4e43] text-white" : "bg-[#FAF6F0] text-[#5c4e43] group-hover:bg-[#5c4e43] group-hover:text-white"
                        )}>
                           <Ticket className="w-4.5 h-4.5" />
                        </div>
                        <div className={cn(
                          "w-5 h-5 border rounded-full flex items-center justify-center transition-all",
                          isApplied ? "border-[#5c4e43] bg-[#5c4e43]" : "border-neutral-200"
                        )}>
                          {isApplied && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                     </div>
                     <p className="font-black text-xs text-[#231f20] mb-1">{v.code}</p>
                     <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed mb-4 line-clamp-2">{v.description || `Giảm ${v.discountValueFormatted} cho đơn từ ${v.minOrderValueFormatted}`}</p>
                     <div className="flex justify-between items-center">
                       <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
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
             className="flex-1 py-3 px-5 border rounded-sm text-xs font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-[#5c4e43] focus:outline-none transition-all uppercase bg-white border-neutral-200"
           />
           <button 
             onClick={handleApply}
             disabled={isApplyingVoucher || !tempCode}
             className="bg-[#231f20] text-white px-8 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#5c4e43] transition-all border-none outline-none cursor-pointer disabled:bg-neutral-100 disabled:text-neutral-400"
           >
             {isApplyingVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Áp dụng'}
           </button>
        </div>
        {appliedVoucherCode && (
          <div className="flex items-center justify-between bg-[#FBF8F3] p-4 rounded-sm border border-[#e8dfd5]/60">
             <span className="text-[10px] font-bold text-[#5c4e43] uppercase tracking-widest">
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
      <div className="bg-[#FBF8F3] border border-[#e8dfd5]/65 p-6 rounded-sm flex flex-col gap-6">
         <h3 className="text-base font-black uppercase tracking-tight text-[#231f20]">Chi tiết thanh toán</h3>
         
         <div className="flex flex-col gap-4 text-xs">
            <div className="flex justify-between font-medium text-neutral-500">
               <span>Tạm tính</span>
               <span className="font-bold text-black">{subtotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between font-medium text-neutral-500">
                 <span>Voucher giảm giá</span>
                 <span className="font-bold text-green-600">-{discountAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-neutral-500">
               <span>Phí giao hàng</span>
               <span className={cn(
                 "font-bold uppercase tracking-widest",
                 shippingFee === 0 ? "text-black text-[9px]" : "text-black text-xs"
               )}>
                 {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} ₫`}
               </span>
            </div>
         </div>

         <div className="pt-5 border-t border-[#e8dfd5]/60 flex justify-between items-center">
            <span className="text-sm font-black uppercase tracking-tight text-[#231f20]">Thành tiền</span>
            <span className="text-xl font-black text-black">{total.toLocaleString('vi-VN')} ₫</span>
         </div>

         <button 
           onClick={onOrder}
           disabled={isSubmitting}
           className={cn(
             "w-full py-4 bg-[#231f20] text-white rounded-sm font-black uppercase tracking-[0.2em] text-xs hover:bg-[#5c4e43] transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-none outline-none cursor-pointer",
             isSubmitting && "bg-[#5c4e43]"
           )}
         >
           {isSubmitting ? (
             <>
               <Loader2 className="w-4 h-4 animate-spin text-white" />
               Đang xử lý đặt hàng...
             </>
           ) : (
             'Đặt hàng'
           )}
         </button>
         
         <p className="text-[9px] text-[#5c4e43] font-bold uppercase tracking-widest text-center mt-1 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Nhận hàng sau 1-3 ngày làm việc
         </p>
      </div>
    </div>
  )
}

export default CartSummary

