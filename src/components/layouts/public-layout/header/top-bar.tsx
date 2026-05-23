'use client'

import React from 'react'
import { Link } from 'next-view-transitions'
import { Phone, ClipboardList, MapPin, Search } from 'lucide-react'

const TopBar = () => {
  return (
    <div className='w-full bg-[#1e1f21] text-white text-[11px] md:text-[12.5px] font-semibold min-h-[38px] flex items-center border-b border-neutral-800 tracking-tight whitespace-nowrap overflow-hidden'>
      <div className='w-full grid grid-cols-1 lg:grid-cols-12 h-full items-center'>
        
        {/* Left Side Accent block (Cyan) */}
        <div className='lg:col-span-4 bg-[#00a2e8] flex items-center justify-center lg:justify-end px-4 xl:px-12 py-2.5 gap-2 text-white h-full'>
          <Phone className='w-3.5 h-3.5 fill-white/20' />
          <span>Hotline đặt hàng: 1800 6013</span>
        </div>
        
        {/* Middle Utilities & Right Search (Dark Gray) */}
        <div className='lg:col-span-8 bg-[#1e1f21] flex flex-col sm:flex-row items-center justify-between px-6 xl:px-12 py-2 gap-4 h-full'>
          {/* Middle links */}
          <div className='flex items-center gap-5 xl:gap-8'>
            <Link 
              href='/order/tracking' 
              className='flex items-center gap-2 hover:text-[#00a2e8] transition-colors text-neutral-200'
            >
              <ClipboardList className='w-4 h-4' />
              <span>Tra cứu tình trạng đơn hàng</span>
            </Link>
            <span className='h-3.5 w-[1px] bg-neutral-700' />
            <Link 
              href='/showrooms' 
              className='flex items-center gap-2 hover:text-[#00a2e8] transition-colors text-neutral-200'
            >
              <MapPin className='w-4 h-4' />
              <span>Hệ thống Showroom</span>
            </Link>
          </div>
          
          {/* Search bar inside top bar */}
          <div className='relative w-full max-w-[240px] xl:max-w-[280px]'>
            <input
              type='text'
              placeholder='Tìm kiếm sản phẩm...'
              className='w-full bg-[#323437] rounded-full py-1.5 pl-4 pr-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#00a2e8]/40 transition-all border border-neutral-700/60 placeholder-neutral-400 font-medium'
            />
            <button className='absolute right-1 top-[3px] w-[26px] h-[26px] bg-white rounded-full flex items-center justify-center text-[#1e1f21] hover:bg-neutral-100 transition-colors shadow-sm'>
              <Search className='w-3.5 h-3.5 text-neutral-800 stroke-[2.5]' />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TopBar
