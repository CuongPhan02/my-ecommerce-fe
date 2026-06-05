'use client'

import React from 'react'
import Image from 'next/image'

export default function LuneCareSection() {
  return (
    <section className='w-full relative overflow-hidden bg-white select-none py-12 md:py-16 border-b border-neutral-100'>
      <div className='max-w-[1400px] mx-auto px-6 md:px-12'>
        <div className='relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FBF8F3] rounded-[2.5rem] overflow-hidden border border-neutral-200/40 min-h-[480px]'>
          
          {/* Left Side: Content Area (5 Columns on Desktop) */}
          <div className='lg:col-span-5 p-8 md:p-12 lg:pr-6 flex flex-col justify-between h-full z-10 space-y-6 md:space-y-8 bg-[#FBF8F3]'>
            <div className='space-y-4 md:space-y-6 text-left'>
              <span className='text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block'>
                LUNÉ CARE
              </span>
              <h2 className='font-heading text-2xl md:text-3xl lg:text-4xl font-black tracking-wide text-black uppercase leading-tight'>
                Thời trang<br className='hidden md:inline' /> vì cộng đồng
              </h2>
              <p className='text-xs md:text-sm text-neutral-500 font-medium leading-relaxed max-w-sm'>
                Chúng tôi trích 10% lợi nhuận từ mỗi đơn hàng để thực hiện các hoạt động thiện nguyện, hỗ trợ trẻ em và cộng đồng có hoàn cảnh khó khăn.
              </p>
              
              <div className='pt-2'>
                <button className='border border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white px-6 md:px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all duration-300'>
                  Xem hành trình yêu thương
                </button>
              </div>
            </div>

            {/* First two counters */}
            <div className='flex items-center gap-8 md:gap-12 pt-6 border-t border-neutral-200/60'>
              <div className='space-y-1 text-left'>
                <p className='text-lg md:text-xl font-bold tracking-tight text-neutral-900'>
                  285.000.000đ+
                </p>
                <p className='text-[10px] md:text-[11px] font-medium text-neutral-400 uppercase tracking-wider'>
                  Đã đóng góp
                </p>
              </div>
              <div className='h-8 w-px bg-neutral-200' />
              <div className='space-y-1 text-left'>
                <p className='text-lg md:text-xl font-bold tracking-tight text-neutral-900'>
                  18
                </p>
                <p className='text-[10px] md:text-[11px] font-medium text-neutral-400 uppercase tracking-wider'>
                  Chương trình
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Image and 3rd Counter (7 Columns on Desktop) */}
          <div className='lg:col-span-7 relative h-[300px] md:h-[400px] lg:h-full w-full min-h-[350px] lg:min-h-[480px] overflow-hidden group'>
            {/* Background Image */}
            <Image
              src='/lune-care-banner.png'
              alt='LUNÉ Care Charity Program'
              fill
              priority
              className='object-cover object-center transition-transform duration-700 group-hover:scale-105'
              sizes='(max-w-720px) 100vw, 58vw'
            />
            
            {/* White-to-Transparent Gradient overlay on the left side of the image (desktop only) */}
            <div className='hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FBF8F3] to-transparent pointer-events-none' />

            {/* Third Counter overlaid on the bottom-left of the image */}
            <div className='absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/95 backdrop-blur-md border border-white/20 p-4 md:p-6 rounded-none shadow-xl max-w-[200px] md:max-w-[240px] text-left transition-transform duration-300 hover:scale-105'>
              <p className='text-lg md:text-xl font-bold tracking-tight text-neutral-900'>
                1.200+
              </p>
              <p className='text-[10px] md:text-[11px] font-medium text-neutral-400 uppercase tracking-wider mt-1 leading-snug'>
                Người & trẻ em được hỗ trợ
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
