'use client'

import React from 'react'
import { _voucherService } from './voucher.query'
import { Ticket, Clock, CheckCircle2, ChevronRight, Info } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Skeleton } from '~/components/ui/core/skeleton'
import { formatVND } from '~/lib/utils'

const VoucherCenter = () => {
  const { data: voucherRes, isLoading } = _voucherService.usePublicVouchers()
  const vouchers = voucherRes?.result || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-[2rem] w-full" />
        ))}
      </div>
    )
  }

  if (vouchers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
        <Ticket className="w-16 h-16 text-gray-200 mb-4" />
        <p className="text-sm font-bold text-gray-400">Hiện không có mã giảm giá nào khả dụng.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vouchers.map((v) => {
        const isExpiredSoon = v.expirationDate && 
          (new Date(v.expirationDate).getTime() - new Date().getTime()) < 86400000 * 2 // 2 days

        return (
          <div 
            key={v.id} 
            className="group relative bg-white rounded-[2.5rem] p-1 border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
          >
            <div className="flex h-full">
              {/* Left "Ticket" Part */}
              <div className={cn(
                "w-32 flex flex-col items-center justify-center gap-2 text-white p-4 rounded-[2.25rem] relative overflow-hidden",
                v.type === 'FREE_SHIPPING' ? "bg-blue-600" : "bg-black"
              )}>
                {/* Punch holes effect */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-white" />
                  ))}
                </div>

                <Ticket className="w-8 h-8 opacity-20 absolute -left-2 -top-2 rotate-12" />
                
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                  {v.type === 'FREE_SHIPPING' ? 'Vận chuyển' : 'Giảm giá'}
                </span>
                <p className="text-xl font-black">
                  {v.type === 'PERCENTAGE' ? `${v.discountValue}%` : v.type === 'FREE_SHIPPING' ? '0đ' : `${v.discountValue / 1000}K`}
                </p>
              </div>

              {/* Right Content Part */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">{v.code}</h4>
                    {v.usageLimit && (
                      <span className="text-[8px] font-black bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                        Còn {v.usageLimit - v.usedCount} lượt
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight line-clamp-2">
                    {v.description || `Giảm ${v.discountValueFormatted} cho đơn hàng từ ${v.minOrderValueFormatted}`}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                  <div className={cn(
                    "flex items-center gap-1.5",
                    isExpiredSoon ? "text-amber-500" : "text-gray-400"
                  )}>
                    <Clock className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {v.expirationDate ? new Date(v.expirationDate).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(v.code)
                      // Could add a toast here
                    }}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:text-black transition-colors group/btn"
                  >
                    Sao chép
                    <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default VoucherCenter
