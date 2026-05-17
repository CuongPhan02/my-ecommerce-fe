'use client'

import React from 'react'
import { Truck, Ticket, Info } from 'lucide-react'
import { cn } from '~/lib/utils'

interface StickyCheckoutBarProps {
  total: number
}

const StickyCheckoutBar = ({ total }: StickyCheckoutBarProps) => {
  return (
    <div className='fixed bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-100 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'>
      <div className='main-container mx-auto px-4 h-24 flex items-center justify-between'>
        {/* Left: Selected Payment & Voucher */}
        <div className='hidden lg:flex items-center gap-12'>
          <div className='flex items-center gap-4 text-gray-700'>
            <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm'>
              <Truck className='w-5 h-5' />
            </div>
            <div>
              <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                Thanh toán
              </p>
              <p className='text-sm font-black'>Khi nhận hàng (COD)</p>
            </div>
          </div>

          <div className='w-px h-10 bg-blue-200' />

          <div className='flex items-center gap-4 text-gray-700'>
            <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm'>
              <Ticket className='w-5 h-5' />
            </div>
            <div>
              <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                Ưu đãi
              </p>
              <p className='text-sm font-black text-blue-600 italic'>
                Chọn Voucher
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Summary Info */}
        <div className='flex-1 flex flex-col items-center lg:items-end lg:pr-12'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl font-black text-blue-600'>
              {total.toLocaleString()}đ
            </span>
            <button className='text-blue-300 hover:text-blue-600 transition-colors'>
              <Info className='w-4 h-4' />
            </button>
          </div>
          <div className='flex items-center gap-3 mt-1'>
            <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>
              <button className='text-blue-600 hover:underline mr-1'>
                Đăng nhập
              </button>
              để hoàn{' '}
              <span className='text-black font-black'>9.000 CoolCash</span>
            </p>
            <span className='text-[10px] text-gray-300 font-bold uppercase tracking-widest border-l pl-3'>
              Tiết kiệm 0đ
            </span>
          </div>
        </div>

        {/* Right: Checkout Button */}
        <div className='h-full bg-black flex items-center px-12 group cursor-pointer hover:bg-primary transition-all'>
          <button className='text-white font-black text-sm uppercase tracking-[0.3em] flex items-center gap-3'>
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  )
}

export default StickyCheckoutBar
