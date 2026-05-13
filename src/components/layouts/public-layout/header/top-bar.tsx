'use client'

import React from 'react'
import { Link } from 'next-view-transitions'
import { ChevronDown } from 'lucide-react'

const TopBar = () => {
  return (
    <div className='w-full bg-[#3c3d41] text-white text-[10px] md:text-[11px] font-medium py-1.5 overflow-hidden border-b border-neutral-700/50 tracking-tight whitespace-nowrap min-h-[32px]'>
      <div className='container-layout flex items-center justify-between px-4 md:px-8'>
        {/* Left Side Branding Links */}
        <div className='flex items-center gap-4 md:gap-6 opacity-90 uppercase'>
          <Link href='#' className='hover:text-primary transition-colors font-bold'>
            Về Coolmate
          </Link>
          <span className='w-[1px] h-3 bg-neutral-500'></span>
          <Link href='#' className='hover:text-primary transition-colors font-bold'>
            CXP BY COOLMATE
          </Link>
          <span className='w-[1px] h-3 bg-neutral-500'></span>
          <Link href='#' className='hover:text-primary transition-colors font-bold'>
            CARE&SHARE
          </Link>
        </div>

        {/* Right Side Utility Links */}
        <div className='hidden md:flex items-center gap-5 opacity-90'>
          <Link href='#' className='flex items-center gap-1 hover:text-primary transition-colors'>
            <span className='text-yellow-400'>★</span> Coolclub
          </Link>
          <Link href='#' className='hover:text-primary transition-colors'>
            Cửa hàng
          </Link>
          <Link href='#' className='hover:text-primary transition-colors'>
            Blog
          </Link>
          <Link href='#' className='hover:text-primary transition-colors'>
            CSKH
          </Link>
          <Link href='/auth/sign-in' className='hover:text-primary transition-colors font-semibold'>
            Đăng nhập
          </Link>
          <div className='flex items-center gap-1 cursor-pointer hover:text-primary transition-colors'>
            <span className='w-4 h-3 bg-red-600 relative overflow-hidden flex items-center justify-center'>
              <span className='text-[6px] text-yellow-400'>★</span>
            </span>
            <span>VN</span>
            <ChevronDown className='w-3 h-3' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
