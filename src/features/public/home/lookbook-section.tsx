'use client'

import React from 'react'
import Image from 'next/image'

export default function LookbookSection() {
  return (
    <section className='w-full bg-[#F5EFE6]/30 py-12 md:py-16 select-none border-b border-neutral-200/20'>
      <div className='max-w-[1400px] mx-auto px-6 md:px-12'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FAF6F0]/80 rounded-[2.5rem] overflow-hidden border border-neutral-200/30'>
          
          {/* Left Side: Lookbook Image */}
          <div className='md:col-span-6 relative h-[350px] md:h-[450px] lg:h-[500px] w-full overflow-hidden group'>
            <Image
              src='/lune-lookbook.png'
              alt='LUNÉ Lookbook Campaign'
              fill
              priority
              className='object-cover object-center transition-transform duration-700 group-hover:scale-105'
              sizes='(max-w-768px) 100vw, 50vw'
            />
          </div>

          {/* Right Side: Lookbook Text & CTA */}
          <div className='md:col-span-6 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left space-y-4 md:space-y-6'>
            <span className='text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 block'>
              LOOKBOOK
            </span>
            <h2 className='font-heading text-2xl md:text-3xl lg:text-4xl font-black tracking-wide text-neutral-900 leading-tight'>
              Tinh tế trong từng khoảnh khắc
            </h2>
            <p className='text-xs md:text-sm text-neutral-500 font-medium leading-relaxed max-w-md'>
              LUNÉ đồng hành cùng bạn trong mọi khoảnh khắc đời thường, từ công sở đến dạo phố.
            </p>
            
            <div className='pt-2'>
              <button className='border border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all duration-300'>
                Xem Lookbook
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
