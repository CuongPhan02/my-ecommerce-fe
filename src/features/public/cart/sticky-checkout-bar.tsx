'use client'

import React from 'react'
import { Truck, Ticket, Info, Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

interface StickyCheckoutBarProps {
  total: number
  paymentMethod: string
  couponCode?: string
  isSubmitting?: boolean
  onOrder: () => void
}

const StickyCheckoutBar = ({ total, paymentMethod, couponCode, isSubmitting, onOrder }: StickyCheckoutBarProps) => {
  return (
    <div className='fixed bottom-0 left-0 right-0 bg-[#FBF8F3] border-t border-[#e8dfd5]/65 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]'>
      <div className='main-container mx-auto px-4 h-20 flex items-center justify-between'>
        {/* Left: Selected Payment & Voucher */}
        <div className='hidden lg:flex items-center gap-12'>
          <div className='flex items-center gap-4 text-[#231f20]'>
            <div className='w-9 h-9 bg-white border border-[#e8dfd5]/55 rounded-sm flex items-center justify-center shadow-xs'>
              <Truck className='w-4 h-4 text-[#5c4e43]' />
            </div>
            <div>
              <p className='text-[9px] font-black uppercase tracking-widest text-[#5c4e43]/70'>
                Thanh toán
              </p>
              <p className='text-xs font-black'>
                {paymentMethod === 'VNPAY' ? 'Ví điện tử VNPAY' : 'Khi nhận hàng (COD)'}
              </p>
            </div>
          </div>

          <div className='w-px h-8 bg-[#e8dfd5]/70' />

          <div className='flex items-center gap-4 text-[#231f20]'>
            <div className='w-9 h-9 bg-white border border-[#e8dfd5]/55 rounded-sm flex items-center justify-center shadow-xs'>
              <Ticket className='w-4 h-4 text-[#5c4e43]' />
            </div>
            <div>
              <p className='text-[9px] font-black uppercase tracking-widest text-[#5c4e43]/70'>
                Ưu đãi
              </p>
              <p className='text-xs font-black text-[#5c4e43] italic'>
                {couponCode ? `Áp dụng: ${couponCode}` : 'Không áp dụng'}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Summary Info */}
        <div className='flex-1 flex flex-col items-center lg:items-end lg:pr-12'>
          <div className='flex items-center gap-2'>
            <span className='text-xl font-black text-black'>
              {total.toLocaleString('vi-VN')} ₫
            </span>
            <button className='text-[#e8dfd5] hover:text-[#5c4e43] transition-colors border-none bg-transparent cursor-pointer'>
              <Info className='w-4 h-4' />
            </button>
          </div>
          <div className='flex items-center gap-3 mt-0.5'>
            <p className='text-[9px] font-semibold text-neutral-400 uppercase tracking-widest'>
              <span className='text-black font-black'>LUNÉ CLUB</span> tích lũy hoàn tiền cho đơn hàng này.
            </p>
          </div>
        </div>

        {/* Right: Checkout Button */}
        <button 
          onClick={onOrder}
          disabled={isSubmitting}
          className={cn(
            'h-full bg-[#231f20] flex items-center px-12 group cursor-pointer hover:bg-[#5c4e43] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none outline-none',
            isSubmitting && 'bg-[#5c4e43]'
          )}
        >
          <span className='text-white font-black text-xs uppercase tracking-[0.25em] flex items-center gap-3 select-none'>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Đang xử lý
              </>
            ) : (
              'Đặt hàng'
            )}
          </span>
        </button>
      </div>
    </div>
  )
}

export default StickyCheckoutBar

