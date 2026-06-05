'use client'

import React from 'react'
import { Facebook, Instagram, Youtube, ChevronDown, Music } from 'lucide-react'

const TopBar = () => {
  return (
    <div className='w-full bg-[#FBF8F3] text-[#231f20] text-[11px] md:text-[12px] font-medium min-h-[38px] flex items-center border-b border-neutral-200/40 select-none'>
      <div className='w-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between gap-4'>
        
        {/* Left Side: Language selector */}
        <div className='hidden sm:flex items-center gap-1 cursor-pointer hover:opacity-85 transition-opacity py-2'>
          <span className='font-bold uppercase tracking-wider'>VI</span>
          <ChevronDown className='w-3 h-3 text-[#231f20]' />
        </div>
        
        {/* Center: Delivery notification */}
        <div className='flex-1 text-center py-2 font-semibold uppercase tracking-wider text-[10px] md:text-[11px] text-neutral-800'>
          Miễn phí vận chuyển cho đơn hàng từ 800.000đ
        </div>
        
        {/* Right Side: Social Media Links */}
        <div className='hidden sm:flex items-center gap-4 py-2 text-neutral-700'>
          <a
            href='#'
            className='hover:text-black transition-colors'
            aria-label='Facebook'
          >
            <Facebook className='w-3.5 h-3.5' />
          </a>
          <a
            href='#'
            className='hover:text-black transition-colors'
            aria-label='Instagram'
          >
            <Instagram className='w-3.5 h-3.5' />
          </a>
          <a
            href='#'
            className='hover:text-black transition-colors'
            aria-label='TikTok'
          >
            <Music className='w-3.5 h-3.5' />
          </a>
          <a
            href='#'
            className='hover:text-black transition-colors'
            aria-label='YouTube'
          >
            <Youtube className='w-3.5 h-3.5' />
          </a>
        </div>

      </div>
    </div>
  )
}

export default TopBar
